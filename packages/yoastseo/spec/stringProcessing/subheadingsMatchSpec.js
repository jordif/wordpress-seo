import subheadingsMatch from "../../src/languages/legacy/stringProcessing/subheadingsMatch";

describe( "subheadingsMatch", function() {
	it( "should return -1 when match is null", function() {
		expect( subheadingsMatch( null ) ).toBe( -1 );
	} );
} );
