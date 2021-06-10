export const FINISH_STEP = "FINISH_STEP";
export const RESET_STEP = "RESET_STEP";
export const RESET_WORKOUT = "RESET_WORKOUT";

/**
 * An action creator for finishing a workout step.
 *
 * @param {String} workout The workout key.
 * @param {String} step The step key.
 *
 * @returns {object} The action object.
 */
export const finishStep = ( workout, step ) => {
	return { type: FINISH_STEP, workout, step };
};

/**
 * An action creator for resetting a workout step.
 *
 * @param {String} workout The workout key.
 * @param {String} step The step key.
 *
 * @returns {object} The action object.
 */
export const resetStep = ( workout, step ) => {
	return { type: RESET_STEP, workout, step };
};

/**
 * An action creator for resetting an entire workout.
 *
 * @param {String} workout The workout key.
 *
 * @returns {object} The action object.
 */
export const resetWorkout = ( workout) => {
	return { type: RESET_WORKOUT, workout };
};
