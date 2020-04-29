import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import DataModel from "./data-model/DataModel.js";

/**
 * A list item containing a word and its occurrence, with a gradient background reflecting the relative occurrence.
 *
 * @constructor
 *
 * @param   {Object} word        The word.
 * @param   {number} occurrences The word's occurrence.
 * @param   {string} width       A string indicating the percentage of the bar that should be coloured purple.
 * @returns {JSX}                The list item.
 */
const WordBar = ( { word, occurrence, width } ) => {
	return (
		<li
			style={ { "--width": `${ width }%` } }
		>
			{ word }
			<span aria-hidden={ true }>{ occurrence }</span>
			<span className="screen-reader-text">{ sprintf( __( "%d occurrences", "yoast-components" ), occurrence ) }</span>
		</li>
	);
};

WordBar.propTypes = {
	word: PropTypes.string.isRequired,
	occurrence: PropTypes.number.isRequired,
	width: PropTypes.string.isRequired,
};

/**
 * The WordOccurrences list, that contains words, their occurrence, and bars reflecting their relative occurrence.
 *
 * @returns {ReactElement} The list of words, their occurrences, and bars.
 */
class WordOccurrences extends React.Component {
	/**
	 * Constructs the WordOccurrences component.
	 *
	 * @param {Object}          props        The props object.
	 * @param {ProminentWord[]} props.words  The array of prominent word objects.
	 * @param {HTMLElement}     props.header The html to render before the list.
	 * @param {HTMLElement}     props.footer The html to render after the list.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			words: [],
		};
	}

	/**
	 * React lifecycle method. See: https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
	 *
	 * Calculates the component state based in incoming props.
	 *
	 * @param {Object} props The incoming props.
	 *
	 * @returns {Object} The derived component state.
	 */
	static getDerivedStateFromProps( props ) {
		const words = [ ...props.words ];
		words.sort( ( a, b ) => {
			return b.getOccurrences() - a.getOccurrences();
		} );
		const allOccurrences = words.map( prominentWord => prominentWord.getOccurrences() );
		const maxOccurrences = Math.max( ...allOccurrences );

		return {
			words: words.map(
				( word ) => {
					const occurrence = word.getOccurrences();
					return {
						name: word.getWord(),
						number: occurrence,
						width: ( occurrence / maxOccurrences ) * 100,
					};
				}
			),
		};
	}

	/**
	 * Renders the WordOccurrences component to the DOM.
	 *
	 * @returns {ReactElement} The rendered WordOccurrences component.
	 */
	render() {
		return (
			<React.Fragment>
				{ this.props.header }
				<DataModel
					items={ this.state.words }
				/>
				{ this.props.footer }
			</React.Fragment>
		);
	}
}

WordOccurrences.propTypes = {
	words: PropTypes.array.isRequired,
	header: PropTypes.element,
	footer: PropTypes.element,
};

WordOccurrences.defaultProps = {
	header: null,
	footer: null,
};

export default WordOccurrences;
