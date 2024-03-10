const fullDayInMinutes = 24 * 60; // 1440 minutes in a day

// Function to convert HH:MM time to minutes
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

// Function to convert minutes back to HH:MM format
const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
};

// Initial structure for a day's full availability before subtracting blocked slots
const getInitialDayAvailability = () => [
    { start: 0, end: fullDayInMinutes - 1 },
];

function subtractTimeSlots(availableSlots, blockedSlots) {
    let resultSlots = [...availableSlots]; // Clone to avoid mutating the original

    blockedSlots.forEach((blocked) => {
        resultSlots = resultSlots.flatMap((slot) => {
            if (isOverlap(slot, blocked)) {
                return splitSlot(slot, blocked);
            }
            return slot;
        });
    });

    return resultSlots.filter((slot) => slot.start !== slot.end); // Remove zero-length slots
}

function isOverlap(slot, blocked) {
    return slot.start < blocked.endTime && slot.end > blocked.startTime;
}

function splitSlot(slot, blocked) {
    const before = { start: slot.start, end: blocked.startTime };
    const after = { start: blocked.endTime, end: slot.end };

    // Return only slots that have a duration
    return [before, after].filter((s) => s.start < s.end);
}

function calculateDurationInMinutes(startTime, endTime) {
    // Split the times into hours and minutes parts
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    // Convert hours and minutes to total minutes
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Calculate the duration
    const duration = endTotalMinutes - startTotalMinutes;

    return duration;
}

function incrementTimeByMinutes(time, minutesToAdd) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(0, 0, 0, hours, minutes + minutesToAdd, 0);

    const HH = String(date.getHours()).padStart(2, "0");
    const MM = String(date.getMinutes()).padStart(2, "0");

    return `${HH}:${MM}`;
}

function initializeStudyPlanWithEmptyDays() {
    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    let studyPlan = {};
    daysOfWeek.forEach((day) => {
        studyPlan[day] = []; // Initialize each day with an empty array
    });
    return studyPlan;
}

function initializeStudyPlanWithEmptyDaysAndUnallocatedSlot() {
    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    let studyPlan = { unallocatedTasks: [] }; // Initialize with a slot for unallocated tasks
    daysOfWeek.forEach((day) => {
        studyPlan[day] = []; // Initialize each day with an empty array
    });
    return studyPlan;
}

function tryAllocateTaskToDay(task, day, availableTimeSlots, studyPlan) {
    for (let i = 0; i < availableTimeSlots[day].length; i++) {
        const slot = availableTimeSlots[day][i];
        const slotDuration = calculateDurationInMinutes(slot.start, slot.end);
        const neededDuration = task.timeNeeded + 15; // Include 15-minute break

        if (slotDuration >= neededDuration) {
            const endTime = incrementTimeByMinutes(slot.start, task.timeNeeded);
            studyPlan[day].push({ ...task, startTime: slot.start, endTime });
            // Adjust slot for next potential task
            slot.start = incrementTimeByMinutes(endTime, 15); // Move start time after break
            return true; // Task allocated
        }
    }
    return false; // Task not allocated
}

function initializeTasksPerDayCount() {
    return {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
    };
}

// const subtractTimeSlots = (availableSlots, blockedSlots) => {
//     blockedSlots.forEach((blocked) => {
//         const blockedStart = timeToMinutes(blocked.startTime);
//         const blockedEnd = timeToMinutes(blocked.endTime);

//         for (let i = 0; i < availableSlots.length; i++) {
//             const slot = availableSlots[i];

//             // If blocked slot overlaps with available slot
//             if (blockedStart <= slot.end && blockedEnd >= slot.start) {
//                 // Remove the current slot and potentially add up to two new slots
//                 availableSlots.splice(i, 1);
//                 i--; // Adjust index since we're removing an item

//                 // Add new slot before the blocked time, if applicable
//                 if (slot.start < blockedStart) {
//                     availableSlots.splice(i + 1, 0, {
//                         start: slot.start,
//                         end: blockedStart - 1,
//                     });
//                     i++;
//                 }

//                 // Add new slot after the blocked time, if applicable
//                 if (slot.end > blockedEnd) {
//                     availableSlots.splice(i + 1, 0, {
//                         start: blockedEnd + 1,
//                         end: slot.end,
//                     });
//                     i++;
//                 }
//             }
//         }
//     });

//     // Convert slots back to HH:MM format for start and end times
//     return availableSlots.map((slot) => ({
//         start: minutesToTime(slot.start),
//         end: minutesToTime(slot.end),
//     }));
// };

const FULL_DAY = { start: "00:00", end: "23:59" };

var helpers = {
    // calculateAvailableTimeSlots: (blockedTimeSlots) => {
    //     // Initialize with full day available for each day of the week
    //     let availableTimeSlots = {
    //         Monday: [{ start: "00:00", end: "23:59" }],
    //         Tuesday: [{ start: "00:00", end: "23:59" }],
    //         Wednesday: [{ start: "00:00", end: "23:59" }],
    //         Thursday: [{ start: "00:00", end: "23:59" }],
    //         Friday: [{ start: "00:00", end: "23:59" }],
    //         Saturday: [{ start: "00:00", end: "23:59" }],
    //         Sunday: [{ start: "00:00", end: "23:59" }],
    //     };

    //     blockedTimeSlots.weeklySchedule.forEach((daySchedule) => {
    //         if (daySchedule.timeBlocks.length > 0) {
    //             availableTimeSlots[daySchedule.day] = subtractTimeSlots(
    //                 availableTimeSlots[daySchedule.day],
    //                 daySchedule.timeBlocks
    //             );
    //         }
    //     });

    //     return availableTimeSlots;
    // },
    calculateAvailableTimeSlots: (blockedTimeSlots) => {
        let availableTimeSlots = {
            Monday: [FULL_DAY],
            Tuesday: [FULL_DAY],
            Wednesday: [FULL_DAY],
            Thursday: [FULL_DAY],
            Friday: [FULL_DAY],
            Saturday: [FULL_DAY],
            Sunday: [FULL_DAY],
        };

        blockedTimeSlots.weeklySchedule.forEach((daySchedule) => {
            if (daySchedule.timeBlocks.length > 0) {
                availableTimeSlots[daySchedule.day] = subtractTimeSlots(
                    availableTimeSlots[daySchedule.day],
                    daySchedule.timeBlocks
                );
            }
        });

        return availableTimeSlots;
    },

    consolidateAvailableTime: (blockedTimeSlots) => {
        const fullDay = { start: "00:00", end: "23:59" };
        let availableTimeSlots = {};

        // Initialize available time for each day as full day
        [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ].forEach((day) => {
            availableTimeSlots[day] = [fullDay];
        });

        // Subtract blocked slots from each day
        blockedTimeSlots.forEach((block) => {
            if (block.timeBlocks && block.timeBlocks.length > 0) {
                block.timeBlocks.forEach((timeBlock) => {
                    availableTimeSlots[block.day] = subtractTimeSlot(
                        availableTimeSlots[block.day],
                        timeBlock
                    );
                });
            }
        });

        return availableTimeSlots;
    },

    sortTasksByPriorityAndDuration: (tasks) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return tasks.sort((a, b) => {
            const priorityDifference =
                priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDifference === 0) {
                return a.timeNeeded - b.timeNeeded; // Sort by duration if priorities are the same
            }
            return priorityDifference;
        });
    },

    allocateTasksToTimeSlots: (availableTimeSlots, sortedTasks) => {
        let studyPlan = initializeStudyPlanWithEmptyDaysAndUnallocatedSlot();
        // let sortedTasks = sortTasks(tasks);

        // Track number of tasks assigned per day to ensure even distribution
        let tasksPerDayCount = initializeTasksPerDayCount();

        sortedTasks.forEach((task) => {
            let daysTried = 0;
            let allocated = false;

            while (!allocated && daysTried < 7) {
                // Find the day with the least number of tasks that hasn't reached its limit
                let [dayToAllocate] = Object.entries(tasksPerDayCount).sort(
                    ([, a], [, b]) => a - b
                )[daysTried];

                allocated = tryAllocateTaskToDay(
                    task,
                    dayToAllocate,
                    availableTimeSlots,
                    studyPlan
                );
                if (allocated) {
                    tasksPerDayCount[dayToAllocate]++;
                } else {
                    daysTried++;
                }
            }

            if (!allocated) {
                studyPlan.unallocatedTasks.push(task);
            }
        });

        return studyPlan;
    },

    // allocateTasksToTimeSlots: (availableTimeSlots, tasks) => {
    //     let studyPlan = {};

    //     tasks.forEach((task) => {
    //         for (let day in availableTimeSlots) {
    //             let dayPlan = availableTimeSlots[day];

    //             for (let i = 0; i < dayPlan.length; i++) {
    //                 let slot = dayPlan[i];
    //                 let slotDuration = calculateDurationInMinutes(
    //                     slot.start,
    //                     slot.end
    //                 );

    //                 if (slotDuration >= task.timeNeeded) {
    //                     if (!studyPlan[day]) studyPlan[day] = [];
    //                     studyPlan[day].push({
    //                         ...task,
    //                         startTime: slot.start,
    //                         endTime: incrementTimeByMinutes(
    //                             slot.start,
    //                             task.timeNeeded
    //                         ),
    //                     });

    //                     // Adjust the start time of the current slot to after the task
    //                     slot.start = incrementTimeByMinutes(
    //                         slot.start,
    //                         task.timeNeeded
    //                     );

    //                     // Break out of the loop once the task is allocated
    //                     break;
    //                 }
    //             }
    //         }
    //     });

    //     return studyPlan;
    // },
};
module.exports = helpers;
