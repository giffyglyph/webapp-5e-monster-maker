import Component from './Component.js';
import Frankenstein from '../frankenstein.js';
import Storage from '../storage.js';
import Helpers from '../helpers.js';
import Router from '../router.js';
import Blueprint from '../classes/blueprint.js';
import Files from '../files.js';
import Tracking from '../tracking.js';
import SRD_MONSTERS from '../consts/srd_monsters.js';

/**
 * A component for managing a list of saved monsters.
 */
class PanelVault extends Component {

	/**
	 * Create a new monster vault panel.
	 * @param {object} options - Component details, such as element/data/children.
	 */
	constructor(options) {
		super(options);

		// Get blueprint and monster details
		this.data.monsters = Storage.getMonsters();
		this.data.monsters.forEach(function(x) {
			try {
				x.monster = Frankenstein.createVaultMonster(x.blueprint);
			} catch (error) {
				console.error("Couldn't create monster profile from blueprint, reverting to default");
				x.monster = Frankenstein.createVaultMonster(new Blueprint());
			}
		});
		this.table = null;
	}

	/**
	 * Render the list of monsters.
	 */
	renderComponent() {
		$(this.el).html(Handlebars.templates["PanelVault"](this.data));
		this.table = $("#table-monsters").DataTable({
			dom: '<"top"lf><"content"rt><"bottom"ip>',
			lengthMenu: [
					[ 10, 25, 50, 100, -1 ],
					[ 'Show 10', 'Show 25', 'Show 50', 'Show 100', 'Show all' ]
			],
			stateSave: true,
			language: {
				sInfo: "Showing _START_ to _END_ of _TOTAL_ monsters",
				sInfoEmpty: "Showing 0 to 0 of 0 monsters",
				sInfoFiltered: "(filtered from _MAX_ total monsters)",
				sLengthMenu: "_MENU_",
				sZeroRecords: "No monsters found",
				search: "",
				paginate: {
					previous: "&lt;",
					next: "&gt;"
				}
			},
			data: this.data.monsters,
			columns: [
				{ data: 'id', className: 'col-id', title: "ID", type: "num" },
				{ data: 'monster.description.name', className: 'col-name', title: "Name" },
				{ data: 'monster.tags', className: 'col-description', title: "Description" },
				{ data: 'monster.description.role', className: 'col-role-rank', title: "Role & Rank" },
				{ data: 'monster.ac.value', className: 'col-ac-hp', title: "AC & HP" },
				{ data: 'monster.description.level', className: 'col-level', title: "Lvl", type: "num" },
				{ data: 'monster.description.role', className: 'col-role', title: "Role" },
				{ data: 'monster.description.rank', className: 'col-rank', title: "Rank" },
				{ data: 'monster.challenge.rating', className: 'col-cr', title: "CR", type: "num" },
				{ data: 'monster.ac.value', className: 'col-ac', title: "AC", type: "num" },
				{ data: 'monster.hp.average', className: 'col-hp', title: "HP", type: "num" }
			],
			columnDefs: [
				{
					targets: [2],
					render: function(data, type, row) {
						return Helpers.formatMonsterDescription(row.monster.description.size, row.monster.description.type, row.monster.tags, row.monster.description.alignment);
					}
				}, {
					targets: [3],
					render: function(data, type, row) {
						return (row.monster.method == "manual") ? "—" : (row.monster.description.role + " " + row.monster.description.rank + ((row.monster.description.rank == "solo") ? " vs " + row.monster.description.players : ""));
					}
				}, {
					targets: [4],
					render: function(data, type, row) {
						return row.monster.ac.value + " AC, " + row.monster.hp.average + " HP";
					}
				}, {
					targets: [5, 9, 10],
					render: function(data, type, row) {
						switch (data) {
							case "—":
								return 0;
							default:
								return data;
						}
					}
				}, {
					targets: [7],
					render: function(data, type, row) {
						return (data == "solo") ? data + " vs " + row.monster.description.players : data;
					}
				}, {
					targets: [8],
					render: function(data, type, row) {
						switch (data) {
							case "—":
								return 0;
							case "1/8":
								return 1/8;
							case "1/4":
								return 1/4;
							case "1/2":
								return 1/2;
							default:
								return data;
						}
					}
				}
			],
			fixedColumns: true,
			autoWidth: false,
			order: [ 0, 'asc' ],
			deferRender: true,
			createdRow: function( row, data, dataIndex ) {
				$(row).html("<td colspan='11'>" + Handlebars.templates["PanelVaultRow"](data) + "</td>");
			}
		});

		// Show any passthrough modals
		if (this.data.passthroughData != null && this.data.passthroughData.showModal != null) {
			$("#" + this.data.passthroughData.showModal).modal("show");
			this.data.passthroughData = null;
		}
	}

	attachListeners() {

		// Open edit panel on monster click
		let table = this.table;
		$(this.el + ' .dataTable').on('click', 'tbody tr', function() {
			Router.setUrl("/vault/" + table.row(this).data().id);
		});

		// Empty the vault by deleting all monsters
		$(this.el).on("click", "#modal-empty .btn-confirm", function() {
			$("#modal-empty").one("hidden.bs.modal", function() {
				Storage.setMonsters([]);
				this.table.clear().draw();
			}.bind(this));
			Tracking.sendEvent('vault', 'click-empty');
		}.bind(this));

		// Empty the vault by deleting all monsters
		$(this.el).on("click", ".btn-export-to-json", function() {
			this.exportVault();
			Tracking.sendEvent('vault', 'click-export-json');
		}.bind(this));

		// Import monsters into the vault
		$(this.el).on("click", ".btn-import-from-json", function() {
			$("#vault-import-file").click();
			Tracking.sendEvent('vault', 'click-import-json');
		}.bind(this));

		// Import SRD monsters into the vault
		$(this.el).on("click", ".btn-import-srd", function() {
			$("#modal-import-srd-monsters").modal("show");
		});

		// Import srd monsters into the vault
		$(this.el).on("click", "#modal-import-srd-monsters .btn-confirm", function() {
			Storage.importMonsters(SRD_MONSTERS);
			panel.data.monsters = Storage.getMonsters();
			panel.data.monsters.forEach(function(x) {
				try {
					x.monster = Frankenstein.createVaultMonster(x.blueprint);
				} catch (error) {
					console.error("Couldn't create monster profile from blueprint, reverting to default");
					x.monster = Frankenstein.createVaultMonster(new Blueprint());
				}
			});
			panel.table.clear().rows.add(panel.data.monsters).draw();
			$("#modal-imported-monsters .count").html(SRD_MONSTERS.length);
			$("#modal-imported-monsters").modal("show");
			Tracking.sendEvent('vault', 'click-import-srd');
		}.bind(this));

		let panel = this;
		$(this.el + " " + "#vault-import-file").change(function() {
			if (this.files && this.files.length > 0) {
				Files.loadTextFile(this.files[0], function (e) {
					let contents = JSON.parse(e.target.result);
					if (contents["vault"]) {
						Storage.importMonsters(contents["vault"]);
						panel.data.monsters = Storage.getMonsters();
						panel.data.monsters.forEach(function(x) {
							try {
								x.monster = Frankenstein.createVaultMonster(x.blueprint);
							} catch (error) {
								console.error("Couldn't create monster profile from blueprint, reverting to default");
								x.monster = Frankenstein.createVaultMonster(new Blueprint());
							}
						});
						panel.table.clear().rows.add(panel.data.monsters).draw();
						$("#modal-imported-monsters .count").html(contents["vault"].length);
						$("#modal-imported-monsters").modal("show");
					} else if (contents["monster"]) {
						Storage.importMonster(contents["monster"]);
						panel.data.monsters = Storage.getMonsters();
						panel.data.monsters.forEach(function(x) {
							try {
								x.monster = Frankenstein.createVaultMonster(x.blueprint);
							} catch (error) {
								console.error("Couldn't create monster profile from blueprint, reverting to default");
								x.monster = Frankenstein.createVaultMonster(new Blueprint());
							}
						});
						panel.table.clear().rows.add(panel.data.monsters).draw();
						$("#modal-imported-monsters .count").html(1);
						$("#modal-imported-monsters").modal("show");
					} else {
						$("#modal-import-monsters-failure").modal("show");
					}
				});
			}
			$("#vault-import-file").val("");
		});
	}

	/**
	 * Clear the datatable.
	 */
	clearComponent() {
		if (this.table != null) {
			this.table.destroy();
			this.table = null;
		}
	}

	/**
	 * Exports the monster vault to a json file.
	 */
	exportVault() {
		Files.saveJson("monster_vault", { vault: Storage.getMonsters() });
	}
}

export default PanelVault;
