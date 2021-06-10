import { createInterpolateElement, render } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper, Button } from "@yoast/components";
import * as actions from "./redux/actions/workouts";
import * as selectors from "./redux/selectors/workouts";
import workoutsReducer from "./redux/reducers/workouts";
import { register, createReduxStore, withDispatch, useSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

const STEPS = {
	chooseCornerstones: "chooseCornerstones",
	markCornerstones: "markCornerstones",
	checkCornerstones: "checkCornerstones",
	checkLinks: "checkLinks",
	addLinks: "addLinks",
};

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Cornerstones = () => {
	const cornerstones = window.wpseoWorkflowsData.cornerstones;
	if ( cornerstones.length > 0 ) {
		return (
			<table className="yoast_help">
				<thead>
					<tr>
						<th>{ __( "Article", "wordpress-seo" ) }</th>
						<th>{ __( "Type", "wordpress-seo" ) }</th>
					</tr>
				</thead>
				<tbody>
					{
						cornerstones.map( function( cornerstone ) {
							return (
								<tr key={ cornerstone.id }>
									<td><a href={ cornerstone.permalink }>{ cornerstone.breadcrumb_title }</a></td>
									<td>{ cornerstone.object_sub_type }</td>
								</tr>
							);
						} )
					}
				</tbody>
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
 *
 * @returns {JSX.Element}
 * @constructor
 */
const IndexablesByLinks = () => {
	const bestlinked = window.wpseoWorkflowsData.mostLinks;
	if ( bestlinked.length > 0 ) {
		return (
			<table className="yoast_help">
				<thead>
					<tr>
						<th>{ __( "Incoming Links", "wordpress-seo" ) }</th>
						<th>{ __( "Article", "wordpress-seo" ) }</th>
						<th>{ __( "Type", "wordpress-seo" ) }</th>
					</tr>
				</thead>
				<tbody>
					{
						bestlinked.map( function( indexable ) {
							return (
								<tr
									key={ indexable.id }
									className={ indexable.is_cornerstone === "1" ? "cornerstone" : "" }
								>
									<td>{ indexable.incoming_link_count || "0" }</td>
									<td>
										{ indexable.is_cornerstone === "1" ? "★ " : "" }
										<a href={ indexable.permalink }>{ indexable.breadcrumb_title }</a>
									</td>
									<td>{ indexable.object_sub_type || indexable.object_type }</td>
								</tr>
							);
						} )
					}
				</tbody>
			</table>
		);
	} else {
		return (
			<p>
				<em>
					{
						__(
							"We were unable to find internal links on your pages. Either you haven't added any internal links " +
							"to your content yet, or Yoast SEO didn't index them. You can have Yoast SEO index your links by running " +
							"the SEO data optimization under SEO > Tools.",
							"wordpress-seo"
						)
					}
				</em>
			</p>
		);
	}
};

const FinishButton = ( { onClick, isFinished } ) => {
	const copy = isFinished ? __( "Reset this step", "wordpress-seo" ) : __( "I've finished this step", "wordpress-seo" );

	return <Button onClick={ onClick }>{ copy }</Button>;
};

/**
 * Renders the WorkflowsPage
 * @returns {wp.Element} The page.
 * @constructor
 */
const WorkFlowsPage = function( { resetStep, finishStep } ) {
	let cornerstoneSteps = useSelect( ( select ) => {
		return select( "yoast-seo/workouts" ).getWorkout( "cornerstone" ).finishedSteps;
	}, [] );

	const toggleStep = ( step ) => {
		if ( cornerstoneSteps.includes( step ) ) {
			return resetStep( "cornerstone", step );
		}
		return finishStep( "cornerstone", step );
	};

	const isFinished = ( step ) => {
		if ( cornerstoneSteps.includes( step ) ) {
			return true;
		}
		return false;
	};
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
			<div className="card">
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
				<ol className="workflow yoast">
					<li className={ isFinished( STEPS.chooseCornerstones ) ? "finished" : "" }>
						<h4>{ __( "Start: Choose your cornerstones!", "wordpress-seo" ) }</h4>
						<div className="workflow__grid">
							<div>
							<p>
								{ __(
									"Your site might not feel that SEO fit just yet. But that's just a matter of time. " +
									"Let's start this workout by choosing your cornerstones.",
									"wordpress-seo"
								) }
							</p>
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
							</div>
							<div>
								<img className="workflow__image" src="https://yoast.com/app/uploads/2021/06/seo_fitness_assistants_unfit.svg" />
							</div>
						</div>
						<FinishButton
							onClick={ () => { toggleStep( STEPS.chooseCornerstones ); } }
							isFinished={ isFinished( STEPS.chooseCornerstones ) }
						/>
					</li>
					<li className={ isFinished( STEPS.markCornerstones ) ? "finished" : "" }>
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
						<p>
							<img src="https://yoast.com/app/uploads/2019/11/stale-cornerstone-content-in-yoast-seo.jpg" />
						</p>
						<FinishButton
							onClick={ () => { toggleStep( STEPS.markCornerstones ); } }
							isFinished={ isFinished( STEPS.markCornerstones ) }
						/>
					</li>
					<li className={ isFinished( STEPS.checkCornerstones ) ? "finished" : "" }>
						<h4>{ __( "Check whether your cornerstones are correct", "wordpress-seo" ) }</h4>
						<p>
							{ __(
								"Check whether the articles you’ve marked as cornerstones are the correct ones in this list:",
								"wordpress-seo"
							) }
						</p>
						<Cornerstones />
						<FinishButton
							onClick={ () => { toggleStep( STEPS.checkCornerstones ); } }
							isFinished={ isFinished( STEPS.checkCornerstones ) }
						/>
					</li>
					<li className={ isFinished( STEPS.checkLinks ) ? "finished" : "" }>
						<h4>{ __( "Check the number of incoming internal links of your cornerstones", "wordpress-seo" ) }</h4>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											"Other articles on your site should link towards your most important cornerstones. " +
											"Below you can check out which articles have the most internal links pointing towards them.",
											"wordpress-seo"
										),
										"<strong>",
										"</strong>"
									),
									{ strong: <strong /> }
								)
							}
						</p>
						<IndexablesByLinks />
						<p>
							<strong>
								{ __( "Check: do your cornerstones have the most internal links pointing towards them?", "wordpress-seo" ) }
							</strong>
						</p>
						<FinishButton
							onClick={ () => { toggleStep( STEPS.checkLinks ); } }
							isFinished={ isFinished( STEPS.checkLinks ) }
						/>
					</li>
					<li className={ isFinished( STEPS.addLinks ) ? "finished" : "" }>
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
						<p>
							<img style={ { maxWidth: "280px" } } src="https://yoast.com/app/uploads/2020/08/internal_links_tool_Yoast_SEO-409x800.png" />
						</p>
						<FinishButton
							onClick={ () => { toggleStep( STEPS.addLinks ); } }
							isFinished={ isFinished( STEPS.addLinks ) }
						/>
					</li>
					<li className={ cornerstoneSteps.length === STEPS.length ? "finished" : "" }>
						<h4>{ __( "Well done!", "wordpress-seo" ) }</h4>
						<div className="workflow__grid">
							<div>
							<p>
								{ __(
									"With your internal links, you’ve shown Google which articles are most important on your " +
									"website! Make sure to check regularly whether your cornerstone approach is still up to date!",
									"wordpress-seo"
								) }
							</p>
							<Button className="yoast-button yoast-button--primary">{ __( "I finished this workout", "wordpress-seo" ) }</Button>
							</div>
							<div>
								<img className="workflow__image" src="https://yoast.com/app/uploads/2021/06/seo_fitness_assistants_fit.svg" />
							</div>
						</div>
					</li>
				</ol>
				<hr />
				<p>
					{
						createInterpolateElement(
							sprintf(
								__(
									"Want to learn more about how to setup a successful cornerstone strategy? %1$sRead our ultimate guide%2$s.",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							),
							// eslint-disable-next-line jsx-a11y/anchor-has-content
							{ a: <a href={ window.wpseoWorkflowsData.cornerstoneGuide } /> }
						)
					}
				</p>
			</div>
		</div>
	);
};

const store = createReduxStore( "yoast-seo/workouts", {
	reducer: workoutsReducer,
	actions,
	selectors,
} );
register( store );

const WorkoutsContainer = compose(
	[
		withDispatch(
			( dispatch ) => {
				const {
					finishStep,
					resetStep,
					resetWorkout,
				} = dispatch( "yoast-seo/workouts" );

				return {
					finishStep,
					resetStep,
					resetWorkout,
				};
			}
		),
	]
)( WorkFlowsPage );

render(
	<WorkoutsContainer />,
	document.getElementById( "wpseo-workflows-container" )
);
