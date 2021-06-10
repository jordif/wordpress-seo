/**
 * Gets the workout data from the state.
 *
 * @param {Object} state The state.
 * @param {Object} workout The workout key.
 *
 * @returns {String} the workout.
 */
export const getWorkout = ( state, workout ) => {
	return state.workouts[ workout ];
};
