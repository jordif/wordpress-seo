/* External dependencies */
import { parseFragment } from "parse5";
import Heading from "../structure/nodes/Heading";
import Paragraph from "../structure/nodes/Paragraph";
import StructuredIrrelevant from "../structure/nodes/StructuredIrrelevant";
import { irrelevantHtmlElements } from "./htmlClasses";

/* Internal dependencies */
import TreeAdapter from "./TreeAdapter";

/**
 * Sets the start and end index of the given node or formatting element,
 * based on its source code location as parsed by `parse5`.
 *
 * @param {Node|FormattingElement} element  The element to set the start and end index of.
 *
 * @returns {void}
 */
const setStartEndIndex = function( element ) {
	if ( element.location ) {
		element.startIndex = element.location.startOffset;
		element.endIndex = element.endTag ? element.location.endTag.endOffset : element.location.endOffset;
	}
};

/**
 * Deletes parameters from the element that are used during parsing,
 * but are not needed for analysis.
 *
 * These are the parameters 'location', 'namespace' and 'tagName'.
 *
 * @param {Object} element  The element to delete parameters of.
 *
 * @returns {void}
 */
const deleteParseParameters = function( element ) {
	delete element.location;
	delete element.namespace;
	delete element.tagName;
};

/**
 * Gets the content of an element (the part _between_ the opening and closing tag) from the HTML source code.
 *
 * @param {StructuredIrrelevant|FormattingElement} element  The element to parse the contents of
 * @param {string} html                                     The source code to parse the contents from
 *
 * @returns {string} The element's contents.
 */
const getElementContent = function( element, html ) {
	const location = element.location;
	if ( location ) {
		const start = location.startTag ? location.startTag.endOffset : location.startOffset;
		const end = location.endTag ? location.endTag.startOffset : location.endOffset;
		return html.slice( start, end );
	}
	return "";
};

/**
 * Removes html tags from the given html string.
 * **Note**: Only the tags are removed, _not_ the element's contents.
 *
 * @param {string} html The html string from which to remove the html tags from.
 *
 * @returns {string} The string with the html tags removed.
 */
const removeHtmlTags = function( html ) {
	return html.replace( /<[^>]*>/g, "" );
};

/**
 * Removes html elements deemed irrelevant for analysis from the given html string.
 *
 * @param {string} html The html string to remove the irrelevant html elements from.
 *
 * @returns {string} The html string with the irrelevant html elements removed.
 */
const removeIrrelevantHtml = function( html ) {
	irrelevantHtmlElements.forEach( tag => {
		const regex = new RegExp( `<${tag}.*>.*</${tag}>`, "g" );
		html = html.replace( regex, "" );
	} );
	return html;
};

/**
 * Sets the start and end position of the formatting elements in the given TextContainer,
 * as found within the text container's text.
 *
 * @param {Heading|Paragraph} node  The TextContainer
 * @param {string} html                  The original html source code
 *
 * @returns {void}
 */
const setStartEndText = function( node, html ) {
	if ( ! node.textContainer.formatting || node.textContainer.formatting.length === 0 ) {
		return;
	}

	const elementsToBeClosed = [];
	/*
	  Keeps track of the current total size of the start and end tags
	  and the irrelevant content that should not be counted towards
	  the start and end position in the text.
	 */
	let totalOffset = node.location.startTag.endOffset;

	node.textContainer.formatting.forEach( element => {
		/*
		  Gather all the elements that can be closed
		  (i.o.w. when we are not nested inside the element).
		 */
		const elementsToClose = elementsToBeClosed.filter( el => el.position <= element.location.startOffset );
		elementsToClose.forEach( el => {
			/*
			  Add the end tag length of the to be closed element to the total offset,
			  and remove the element from the stack.
			 */
			totalOffset += el.length;
			const index = elementsToBeClosed.indexOf( el );
			elementsToBeClosed.splice( index, 1 );
		} );

		const startTag = element.location.startTag;
		const endTag = element.location.endTag;
		// "<strong>".length
		const startTagLength = startTag.endOffset - startTag.startOffset;

		const rawContent = getElementContent( element, html );
		const content = removeHtmlTags( removeIrrelevantHtml( rawContent ) );

		totalOffset += startTagLength;

		// Not all elements have end tags (e.g. void elements like images and self-closing elements).
		if ( endTag ) {
			// "</strong>".length
			const endTagLength = endTag.endOffset - endTag.startOffset;
			elementsToBeClosed.push( {
				type: element.type,
				position: endTag.endOffset,
				length: endTagLength,
			} );
		}

		// Set start and end position of element in textContainer's text.
		element.startText = startTag.endOffset - totalOffset;
		element.endText = element.startText + content.length;

		/*
		  If this element is an irrelevant element
		  its contents are not in the text,
		  so the total offset should be updated.
		 */
		if ( irrelevantHtmlElements.includes( element.type ) ) {
			// Has 0 length in text, so end = start.
			element.endText = element.startText;
			totalOffset += rawContent.length;
		}
	} );
};

/**
 * Cleans up the given tree after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {Node} tree		The tree structure to be cleaned.
 * @param {string} html	The original HTML source code.
 *
 * @returns {Node} The cleaned u tree.
 */
const cleanUpAfterParsing = function( tree, html ) {
	let endIndexRootNode = 0;
	tree.map( node => {
		// Set content of irrelevant node, based on original source code.
		if ( node instanceof StructuredIrrelevant ) {
			node.content = getElementContent( node, html );
		}

		// Clean up formatting elements.
		if ( node instanceof Paragraph || node instanceof Heading ) {
			setStartEndText( node, html );
			node.textContainer.formatting = node.textContainer.formatting.map( element => {
				setStartEndIndex( element );
				deleteParseParameters( element );

				return element;
			} );
		}

		setStartEndIndex( node );
		deleteParseParameters( node );

		endIndexRootNode = Math.max( node.endIndex, endIndexRootNode );

		return node;
	} );
	// Set root node's end index to end of text.
	tree.endIndex = endIndexRootNode;
	return tree;
};

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html	The html-string that should be parsed.
 * @returns {Node} The tree.
 */
export default function( html ) {
	const treeAdapter = new TreeAdapter();
	let tree = parseFragment( html, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
	// Cleanup takes < 2ms, even after parsing a big HTML file. (measured using `console.time`).
	tree = cleanUpAfterParsing( tree, html );
	return tree;
}
