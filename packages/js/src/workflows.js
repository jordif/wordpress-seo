import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Paper } from "@yoast/components";

/**
 * Renders the WorkflowsPage
 * @returns {JSX.Element} The page.
 * @constructor
 */
const WorkFlowsPage = function() {
	return (
		<div>
			<h1>
				{ __( "Workflows", "wordpress-seo" ) }
			</h1>
			<p>
				{ __(
					"Getting your site in shape and keeping it SEO fit can be challenging. Let us help you get started by taking on" +
					" the most common SEO challenges, with these step by step workflows,",
					"wordpress-seo"
				) }
			</p>
			<Paper style={ { maxWidth: "600px", padding: "16px" } }>
				<h2>{ __( "The cornerstone approach", "wordpress-seo" ) }</h2>
				<h3>{ __( "Rank with articles you want to rank with", "wordpress-seo" ) }</h3>
				<p>
					{ __(
						"On your site, you'll probably have a few articles that are most important. Articles you want to rank with in Google." +
						" At Yoast, We call these articles your cornerstone articles. Let us walk you through how Yoast SEO helps you set up a" +
						" cornerstone strategy.",
						"wordpress-seo"
					) }
				</p>
				<hr/>
				<ol>
					<li>
						<h4>{ __( "Start by choosing your cornerstones", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"Which articles are most precious to you? Which are the most complete and authoritative?" +
								" Choose these to be your cornerstone content.",
								"wordpress-seo"
							) }
						</p>
					</li>
					<li>
						<h4>{ __( "Mark these articles as cornerstone content", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"Navigate to the Post overview. Find - and go into - these articles and mark them as cornerstone content.",
								"wordpress-seo"
							) }
						</p>
						<img style={ { maxWidth: "560px" } } src="https://yoast.com/app/uploads/2019/11/stale-cornerstone-content-in-yoast-seo.jpg" />
					</li>
					<li>
						<h4>{ __( "Check if your cornerstones are correct", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"In the Post overview, use our Cornerstone content filter to check if you're satisfied with" +
								" the cornerstone articles you've picked",
								"wordpress-seo"
							) }
						</p>
						<img style={ { maxWidth: "560px" } } src="https://yoast.com/app/uploads/2017/04/overview-cornerstones.png" />
					</li>
					<li>
						<h4>{ __( "Check for internal links", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"You want your cornerstone articles to have the most internal links (other articles linking to your" +
								" cornerstone article). You can sort your articles based on incoming link counts in the post overview" +
								" to see if this is the case.",
								"wordpress-seo"
							) }
						</p>
						<img style={ { maxWidth: "560px" } } src="https://yoast.com/app/uploads/2017/07/text-links-counter.png" />
					</li>
					<li>
						<h4>{ __( "If too little, at links from other articles", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"If you have a limited number of internal links for your cornerstone articles, make sure to add some!" +
								" But, do make sure there's a logical relationship between the article you're linking from and the" +
								" cornerstone article you're linking to. For this you can use our internal linking suggestions.",
								"wordpress-seo"
							) }
						</p>
						<img style={ { maxWidth: "280px" } } src="https://yoast.com/app/uploads/2020/08/internal_links_tool_Yoast_SEO-409x800.png" />
					</li>
					<li>
						<h4>{ __( "All set!", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"Well done! You've taken the first steps into setting up a cornerstone strategy for your site." +
								" Make sure to regularly check if this strategy is up to date.",
								"wordpress-seo"
							) }
						</p>
					</li>
				</ol>
			</Paper>
		</div>
	);
};

render(
	<WorkFlowsPage />,
	document.getElementById( "wpseo-workflows-container" )
);

