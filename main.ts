import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import YG from "widget"
export default class YouglishPlugin extends Plugin {
	widget: any;
	views = 0;
	curTrack = 0;
	totalTracks = 0;
	language = "english";

	onYouglishAPIReady(str: string) {
		this.widget = new YG.Widget("widget-1", {
			width: 640,
			components: 255,
			events: {
				'onFetchDone': this.onFetchDone,
				'onVideoChange': this.onVideoChange,
				'onCaptionConsumed': this.onCaptionConsumed
			}
		});
		// 4. process the query
		this.widget.fetch(str, this.language);
	}

	// 5. The API will call this method when the search is done
	onFetchDone(event: any) {
		if (event.totalResult === 0) alert("No result found");
		else this.totalTracks = event.totalResult;
	}

	// 6. The API will call this method when switching to a new video. 
	onVideoChange(event: any) {
		this.curTrack = event.trackNumber;
		this.views = 0;
	}

	// 7. The API will call this method when a caption is consumed. 
	onCaptionConsumed(event: any) {
		if (++this.views < 3)
			this.widget.replay();
		else
			if (this.curTrack < this.totalTracks)
				this.widget.next();
	}

	onload() {
		console.log('loading plugin');
		this.addRibbonIcon('languages', 'Youglish Plugin', () => {
			new SampleModal(this.app).open();
			let leaf = this.app.workspace.activeLeaf;
			this.onYouglishAPIReady(leaf.view.currentMode.cmEditor.getSelection());
		});

		this.addCommand({
			id: 'open-youglish-modal',
			name: 'Say It!',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
						this.onYouglishAPIReady(leaf.view.currentMode.cmEditor.getSelection());
						console.log(this)
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading plugin');
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		this.contentEl.innerHTML = '<div id="widget-1"></div>'
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: YouglishPlugin
	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for Youglish plugin.' });

		new Setting(containerEl)
			.setName('Language')
			.setDesc('The language of youtube videos')
			.addDropdown((cb) => {
				cb.addOption("arabic", "Arabic");
				cb.addOption("english", "English");
				cb.addOption("french", "French");
				cb.addOption("spanish", "Spanish");
				cb.addOption("italian", "Italian");
				cb.addOption("portuguese", "Portuguese");
				cb.addOption("german", "German");
				cb.addOption("korean", "Korean");
				cb.addOption("turkish", "Turkish");
				cb.addOption("russian", "Russian");
				cb.addOption("chinese", "Chinese");
				cb.addOption("dutch", "dutch");
				cb.addOption("greek", "greek");
				cb.addOption("hebrew", "hebrew");
				cb.addOption("japanese", "japanese");
				cb.addOption("polish", "polish");
				cb.addOption("sign language", "Sign language");
				cb.setValue(this.plugin.language);
				cb.onChange(value => this.plugin.language = value);
			})

	}
}
