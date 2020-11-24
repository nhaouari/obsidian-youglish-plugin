import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import YG from "widget"
export default class MyPlugin extends Plugin {
	widget:any;
	views:number;
	curTrack: number; 
	totalTracks:number;

	onYouglishAPIReady(){
		this.widget = new YG.Widget("widget-1", {
		  width: 640,
		  components:255	, //search box & caption 
		  events: {
			'onFetchDone': this.onFetchDone,
			'onVideoChange': this.onVideoChange,
			'onCaptionConsumed': this.onCaptionConsumed
		  }          
		});
		// 4. process the query
		this.widget.fetch("courage","english","us");
	}

	 // 5. The API will call this method when the search is done
	  onFetchDone(event:any){
		if (event.totalResult === 0)   alert("No result found");
		else this.totalTracks = event.totalResult; 
	  }
		 
	  // 6. The API will call this method when switching to a new video. 
	   onVideoChange(event:any){
		this.curTrack = event.trackNumber;
		this.views = 0;
	  }
		 
	  // 7. The API will call this method when a caption is consumed. 
	   onCaptionConsumed(event:any){
		if (++this.views < 3)
		  this.widget.replay();
		else 
		  if (this.curTrack < this.totalTracks)  
			this.widget.next();
	  }

	onload() {
		console.log('loading plugin');	
		
		 this.views = 0;
		 this.curTrack = 0;
		 this.totalTracks = 0;
	   
		

		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice!');
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'open-youglish-modal',
			name: 'Open youglish Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
						this.onYouglishAPIReady();
						console.log(this)
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerEvent(this.app.on('codemirror', (cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		}));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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
		let {contentEl} = this;
		this.contentEl.innerHTML='<div id="widget-1"></div>'
		

		console.log(contentEl)
		
		
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for youglish plugin.'});
		
		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange((value) => {
					console.log('Secret: ' + value);
				}));

	}
}
