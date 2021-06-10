import {
	FINISH_STEP,
	RESET_STEP,
	RESET_WORKOUT,
} from "../actions/workouts";

/**
 * Initial state
 */
const initialState = {
	workouts: {
		cornerstone: {
			finishedSteps: [],
		},
	},
};

/**
 * A reducer for the FacebookPreview object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated socialpreview results object.
 */
const workoutsReducer = ( state = initialState, action ) => {
	const newState = Object.assign( {}, state );
	switch ( action.type ) {
		case FINISH_STEP:
			newState.workouts[ action.workout ].finishedSteps = [ ...state.workouts[ action.workout ].finishedSteps, action.step ];
			return newState;
		case RESET_STEP:
			let index = state.workouts[ action.workout ].finishedSteps.indexOf( action.step );
			if ( index > -1 ) {
				newState.workouts[ action.workout ].finishedSteps = state.workouts[ action.workout ].finishedSteps.slice();
				newState.workouts[ action.workout ].finishedSteps.splice( index, 1 );
			}
			return newState;
		case RESET_WORKOUT:
			newState.workouts[ action.workout ].finishedSteps = [];
			return newState;
		default:
			return state;
	}
};

export default workoutsReducer;
