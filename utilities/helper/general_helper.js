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

const FULL_DAY = { start: "00:00", end: "23:59" };

var helpers = {
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
};

module.exports = helpers;
