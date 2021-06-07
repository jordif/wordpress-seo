import { createInterpolateElement, render } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper } from "@yoast/components";

const Cornerstones = function() {
	const cornerstones = window.wpseoWorkflowsData.cornerstones;
	if ( cornerstones.length > 0 ) {
		return (
			<table>
				<tr>
					<th>{ __( "Article", "wordpress-seo" ) }</th>
					<th>{ __( "Type", "wordpress-seo" ) }</th>
					<th>{ __( "Incoming links", "wordpress-seo" ) }</th>
				</tr>
				{
					cornerstones.map( function( cornerstone ) {
						return (
							<tr key={ cornerstone.id }>
								<td><a href={ cornerstone.permalink }>{ cornerstone.breadcrumb_title }</a></td>
								<td>{ cornerstone.object_sub_type }</td>
								<td>{ cornerstone.incoming_link_count || 0 }</td>
							</tr>
						);
					} )
				}
			</table>
		);
	} else {
		return (
			<p>
				<em>
					{
						__(
							"You currently have no articles marked as cornerstone." +
							" When you mark your articles as cornerstone, they will show up here.",
							"wordpress-seo"
						)
					}
				</em>
			</p>
		);
	}
};

/**
 * Renders the WorkflowsPage
 * @returns {wp.Element} The page.
 * @constructor
 */
const WorkFlowsPage = function() {
	return (
		<div>
			<h1>
				{ __( "SEO Workouts", "wordpress-seo" ) }
			</h1>
			<p>
				{ __(
					"Getting your site in shape and keeping it SEO fit can be challenging. Let us help you get started by taking on" +
					" the most common SEO challenges, with these step by step SEO workouts,",
					"wordpress-seo"
				) }
			</p>
			<Paper style={ { maxWidth: "600px", padding: "16px" } }>
				<h2>{ __( "The cornerstone approach", "wordpress-seo" ) }</h2>
				<h3>{ __( "Rank with articles you want to rank with", "wordpress-seo" ) }</h3>
				<p>
					{
						createInterpolateElement(
							sprintf(
								__(
									"On your site you have a few articles that are %1$sthe%2$s most important. You want to rank highest in " +
									"Google with these articles. At Yoast, we call these articles cornerstone articles. Take the " +
									"following 6 steps in order to start ranking with your cornerstone articles!",
									"wordpress-seo"
								),
								"<em>",
								"</em>"
							),
							{ em: <em /> }
						)
					}
				</p>
				<hr />
				<ol>
					<li>
						<h4>{ __( "Choose your cornerstones!", "wordpress-seo" ) }</h4>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											"With which articles do you want to rank highest? Which are the most complete, which are the " +
											"best explainers, which are %1$sthe%2$s most important? Check out your own website and choose the " +
											"pages and posts you want to be your cornerstone articles!",
											"wordpress-seo"
										),
										"<em>",
										"</em>"
									),
									{ em: <em /> }
								)
							}
						</p>
					</li>
					<li>
						<h4>{ __( "Mark these articles as cornerstone content", "wordpress-seo" ) }</h4>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											"Surf to each one of your cornerstones on your own website. Hit %1$sedit post%2$s and go to the " +
											"WordPress Backend. Mark them as cornerstones in the SEO tab of the metabox or the sidebar " +
											"of Yoast SEO.",
											"wordpress-seo"
										),
										"<em>",
										"</em>"
									),
									{ em: <em /> }
								)
							}
						</p>
						<img style={ { maxWidth: "560px" } } src="https://yoast.com/app/uploads/2019/11/stale-cornerstone-content-in-yoast-seo.jpg" />
					</li>
					<li>
						<h4>{ __( "Check whether your cornerstones are correct", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"Check whether the articles you’ve marked as cornerstones are the correct ones in this list:",
								"wordpress-seo"
							) }
						</p>
						<Cornerstones />
					</li>
					<li>
						<h4>{ __( "Check the number of incoming internal links of your cornerstones", "wordpress-seo" ) }</h4>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											"Other articles on your site should link towards your most important cornerstones. Use the %1$sText " +
											"Link Counter%2$s in the post overview to check out which articles have the most internal links " +
											"pointing towards them.",
											"wordpress-seo"
										),
										"<strong>",
										"</strong>"
									),
									{ strong: <strong /> }
								)
							}
						</p>
						<p>
							<strong>
								{ __( "Check: do your cornerstones have the most internal links pointing towards them?", "wordpress-seo" ) }
							</strong>
						</p>
						<img style={ { maxWidth: "560px" } } src="https://yoast.com/app/uploads/2017/07/text-links-counter.png" />
					</li>
					<li>
						<h4>{ __( "Add internal links towards your cornerstones", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"If you have limited internal links pointing towards your cornerstones, add internal links from " +
								"other posts to your cornerstones. But, make sure that there’s a logical relationship between the " +
								"article you're linking from and your cornerstone. For this you can use our internal linking suggestions.",
								"wordpress-seo"
							) }
						</p>
						<p>
							<strong>
								{ __(
									"Go to a related article, find a relevant sentence which is related to your cornerstone " +
									"article. Insert a text link to your cornerstone in that sentence. Repeat with another related " +
									"article until your cornerstones have the most internal links pointing towards them.",
									"wordpress-seo"
								) }
							</strong>
						</p>
						<img style={ { maxWidth: "280px" } } src="https://yoast.com/app/uploads/2020/08/internal_links_tool_Yoast_SEO-409x800.png" />
					</li>
					<li>
						<h4>{ __( "Well done!", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"With your internal links, you’ve shown Google which articles are most important on your " +
								"website! Make sure to check regularly whether your cornerstone approach is still up to date!",
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

