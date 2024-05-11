class TelegramCommentsPlugin {
	constructor (API, name, config) {
		this.API = API;
		this.name = name;
		this.config = config;
	}

	addInsertions () {
		this.API.addInsertion('customCommentsCode', this.addPostScripts, 1, this);
	}

	addPostScripts (rendererInstance, context) {
		let url = '';
		let uniquePageID = '';
		let cookieBannerGroup = 'text/javascript';
		let consentScriptToLoad = '';
		let consentNotice = '';
		let cssHeaderClass = ` class="${this.config.cssHeaderClass}"`;
		let cssWrapperClass = ` class="${this.config.cssWrapperClass}"`;
		let cssInnerWrapperClass = ` class="${this.config.cssInnerWrapperClass}"`;
		let dislikesNumber = Number(this.config.dislikes);
		let outlinedNumber = Number(this.config.outlined);
		let colorfulNumber = Number(this.config.colorful);
		let darkNumber = Number(this.config.dark);

		if (!this.config.cssHeaderClass) {
			cssHeaderClass = '';
		}

		if (!this.config.cssWrapperClass) {
			cssWrapperClass = '';
		}

		if (!this.config.cssInnerWrapperClass) {
			cssInnerWrapperClass = '';
		}

		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			url = rendererInstance.globalContext.website.pageUrl;
		}

		if (context && context.post && context.post.id) {
			uniquePageID = context.post.id;
		} else {
			uniquePageID = url;
		}

		let heading = `
			<h${this.config.headingLevel}${cssHeaderClass}>
		        ${this.config.textHeader}
		    </h${this.config.headingLevel}>
	    `;

	    if (!this.config.textHeader) {
	    	heading = '';
	    }

		let scriptToLoad = `
			<script async src="https://comments.app/js/widget.js?3"
			        data-comments-app-website="${this.config.siteId}"
			        data-limit="${this.config.limit}"
			        data-page-id="${uniquePageID}"
			        data-color="${this.config.color}"
			        data-dislikes="${dislikesNumber}"
			        data-outlined="${outlinedNumber}"
			        data-colorful="${colorfulNumber}"
			        data-dark="${darkNumber}"></script>
		`;

		if (this.config.cookieBannerIntegration) {
			cookieBannerGroup = 'gdpr-blocker/' + this.config.cookieBannerGroup.trim();
			consentScriptToLoad = `document.body.addEventListener('publii-cookie-banner-unblock-${this.config.cookieBannerGroup.trim()}', function () {
				document.getElementById('comments-no-consent-info').style.display = 'none';
			}, false);`;
			consentNotice = `<div
				data-gdpr-group="${cookieBannerGroup}"
				id="comments-no-consent-info" 
				style="background: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; color: #666; display: block; padding: 10px; text-align: center; width: 100%;">
				${this.config.cookieBannerNoConsentText}
			</div>`;
		}

		return `
			<div${cssWrapperClass}>
	            <div${cssInnerWrapperClass}>
	               	${heading}
					
					<div id="comments_thread"></div>
					<noscript>
						${this.config.textFallback}
					</noscript>
					${consentNotice}
					<script type="${cookieBannerGroup}">
						var comments_config = function () {
							this.page.url = '${url}';
							this.page.identifier = '${uniquePageID}'; 
							this.language = '${this.config.language}';
						};
						</script>
						
						${scriptToLoad}
					
					<script type="text/javascript">
						${consentScriptToLoad}
					</script>
				</div>
			</div>
    	`;
	}
}

module.exports = TelegramCommentsPlugin;
