import participleRegexesFactory from "../../../src/languages/legacy/researches/passiveVoice/periphrastic/matchParticiples";
const participleRegexes = participleRegexesFactory();

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "demonstrado", "pt" ) ).toEqual( [ "demonstrado" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "hoje", "pt" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.irregularParticiples( "", "pt" ) ).toEqual( [] );
	} );
} );
