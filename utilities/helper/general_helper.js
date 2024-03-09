const env = process.env.NODE_ENV;
const moment = require("moment-timezone");

const randomString = (length, capslock = 0) => {
    let chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    if (capslock == 1) {
        return result.toUpperCase();
    } else {
        return result;
    }
};

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
        return tasks.sort(
            (a, b) =>
                priorityOrder[a.priority] - priorityOrder[b.priority] ||
                a.timeNeeded - b.timeNeeded
        );
    },

    allocateTasksToTimeSlots: (
        availableTimeSlots,
        sortedTasks,
        maxTasksPerDay = 2
    ) => {
        let studyPlan = initializeStudyPlanWithEmptyDaysAndUnallocatedSlot();
        let tasksToAllocate = [...sortedTasks]; // Clone to manipulate list

        // Attempt to allocate each task respecting maxTasksPerDay initially
        for (let pass = 1; pass <= 2; pass++) {
            // Two passes: initial and adjustment if needed
            tasksToAllocate = tasksToAllocate.filter((task) => {
                let allocated = false;

                for (let day of Object.keys(availableTimeSlots)) {
                    if (allocated) break; // Break if already allocated in this pass
                    if (
                        studyPlan[day].length >=
                        (pass === 1 ? maxTasksPerDay : Infinity)
                    )
                        continue; // Respect maxTasksPerDay in the first pass only

                    // Try to allocate task to this day
                    allocated = tryAllocateTaskToDay(
                        task,
                        day,
                        availableTimeSlots,
                        studyPlan
                    );
                }

                return !allocated; // Return tasks that were not allocated for potential next pass
            });

            if (pass === 1 && tasksToAllocate.length === 0) break; // If all tasks are allocated in the first pass, no need for a second pass
        }

        // Any tasks that couldn't be allocated even after adjusting for maxTasksPerDay are added to unallocated
        tasksToAllocate.forEach((task) =>
            studyPlan.unallocatedTasks.push(task)
        );

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

    generatePassword: async () => {
        let randomPass = await randomString(8);
        console.log("randomPass", randomPass);
        return randomPass;
    },

    total_ref_count: async (referral_code) => {
        let qb = await pool.get_connection();
        let query = `SELECT COUNT(*) AS total_referrals
                    FROM mx_users
                    WHERE referred_by = '${referral_code};'`;
        let response = await qb.query(query);
        console.log(query);
        qb.release();

        return response;
    },

    highest_serial: async () => {
        let qb = await pool.get_connection();
        let query = `SELECT COALESCE(MAX(serial), 0) AS highest_serial FROM nws_category_serial;`;
        let response = await qb.query(query);
        console.log(query);
        qb.release();

        return response;
    },

    total_complete_job_count: async (expert_id) => {
        let qb = await pool.get_connection();
        let query = `SELECT SUM(total_count) AS total_complete_jobs FROM ( SELECT COUNT(*) AS total_count FROM mx_applied_jobs WHERE work_status = 0 AND req_status = 0 AND deleted = 0 AND expert_id = ${expert_id} UNION ALL SELECT COUNT(*) AS total_count FROM mx_bookings WHERE work_status = 0 AND req_status = 0 AND cancelled = 0 AND deleted = 0 AND expert_id = ${expert_id} ) AS combined_counts;
                    `;
        let response = await qb.query(query);
        console.log(query);
        qb.release();

        return response;
    },

    dashboardData: async (date_condition) => {
        let qb = await pool.get_connection();

        let final_cond = " WHERE deleted = 0 AND status = 0 ";

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " WHERE deleted = 0 AND status = 0 ") {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        let query = `SELECT
                        (SELECT COUNT(*) FROM nws_categories ${final_cond}) AS total_categories,
                        (SELECT COUNT(*) FROM nws_sub_categories ${final_cond}) AS total_sub_categories,
                        (SELECT COUNT(*) FROM nws_users ${final_cond}) AS total_users,
                        (SELECT COUNT(*) FROM nws_posts ${final_cond}) AS total_posts,
                        (SELECT COUNT(*) FROM nws_subscribers ${final_cond}) AS total_subscribers;
                    `;
        let response = await qb.query(query);
        console.log(query);
        qb.release();

        return response;
    },

    get_user_id_by_email: async (email) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("id")
            .where({ email: email })
            .get(config.table_prefix + "users");
        qb.release();

        if (response[0]) {
            return response[0]?.id;
        } else {
            return "";
        }
    },

    check_if_email_exist: async (email, table) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("id")
            .where({ email: email })
            .get(config.table_prefix + table);
        qb.release();

        if (response.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    get_data_list: async (selection, dbtable, condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select(selection)
            .where(condition)
            .get(config.table_prefix + dbtable);
        console.log(qb.last_query());
        qb.release();
        return response;
    },

    get_like_data: async (search, dbtable) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";
        if (Object.keys(search).length) {
            let like_search_str = await helpers.get_conditional_or_like_string(
                search
            );
            if (final_cond == " where ") {
                final_cond = final_cond + like_search_str;
            } else {
                final_cond = final_cond + " and " + like_search_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query =
            "select * from " +
            config.table_prefix +
            dbtable +
            final_cond +
            " ORDER BY id DESC";
        console.log(query);
        let response = await qb.query(query);
        qb.release();
        return response;
    },

    calculateAge: async (dateOfBirth) => {
        const dob = new Date(dateOfBirth);
        const now = new Date();
        const yearDiff = now.getFullYear() - dob.getFullYear();
        const monthDiff = now.getMonth() - dob.getMonth();
        const dayDiff = now.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return yearDiff - 1;
        } else {
            return yearDiff;
        }
    },

    // getUserLoginInfo: async (req) => {
    //     const userAgent = useragent.parse(req.headers["user-agent"]);
    //     const ip = requestIp.getClientIp(req);
    //     try {
    //         const response = await axios.get(
    //             `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEO_LOCATION_API}&ip=${ip}`
    //         );
    //         const { country_name: country } = response.data;
    //         return {
    //             deviceName: userAgent.device,
    //             browser: userAgent.browser,
    //             ip,
    //             country,
    //         };
    //     } catch (error) {
    //         console.error("Error fetching IP geolocation:", error);
    //     }
    // },

    getCurrentDateTime: async () => {
        const dateTimeInDhaka = moment
            .tz("Asia/Dhaka")
            .format("YYYY-MM-DD HH:mm:ss");

        console.log(dateTimeInDhaka);
        return dateTimeInDhaka;
    },

    saveUserLoginInfo: async (userId, userInfo) => {
        console.log("userInfo", userInfo);
        let qb = await pool.get_connection();
        try {
            let data = {
                user_id: userId,
                device_name: userInfo?.deviceName,
                ip_address: userInfo?.ip,
                country: userInfo?.country,
                browser: userInfo?.browser,
            };
            let response = await qb
                .returning("id")
                .insert(config.table_prefix + "login_history", data);
            qb.release();
            console.log("login data recorded");
            return response;
        } catch (error) {
            console.error("Error saving user info:", error);
        }
    },

    checkExistence: async (table, field, value) => {
        const result = await helpers.get_data_list("*", table, {
            [field]: value,
        });
        return result.length > 0;
    },

    delete_common_entry: async (condition, dbtable) => {
        const qb = await pool.get_connection();
        const response = await qb.delete(
            config.table_prefix + dbtable,
            condition
        );
        qb.release();
        console.log(qb.last_query());
        return response;
    },

    generateOtp: async (size) => {
        const zeros = "0".repeat(size - 1);
        const x = parseFloat("1" + zeros);
        const y = parseFloat("9" + zeros);
        const confirmationCode = String(Math.floor(x + Math.random() * y));
        return confirmationCode;
    },

    common_count: async (condition, date_condition, search, dbtable) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (Object.keys(search).length) {
            let date_like_search_str =
                await helpers.get_conditional_or_like_string(search);
            if (final_cond == " where ") {
                final_cond = final_cond + date_like_search_str;
            } else {
                final_cond = final_cond + " and " + date_like_search_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query =
            "select count(*) as total from " +
            config.table_prefix +
            dbtable +
            final_cond;

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },

    get_amount_condition: async (range, field_name) => {
        if (range?.from > 0 && range?.to > 0) {
            return `${field_name} >= ${range?.from} AND ${field_name} <= ${range?.to}`;
        } else if (range?.from > 0 && !range?.to) {
            return `${field_name} >= ${range?.from}`;
        } else if (range?.to > 0 && !range?.from) {
            return `${field_name} <= ${range?.to}`;
        }
    },

    get_avg_rating: async (review_to) => {
        let qb = await pool.get_connection();
        let query = `SELECT review_to, COALESCE(AVG(rating), 0) AS average_rating FROM mx_reviews WHERE review_to = ${review_to} GROUP BY review_to;`;
        let response = await qb.query(query);
        qb.release();
        return response;
    },

    common_add: async (data, table) => {
        let qb = await pool.get_connection();
        let response = await qb
            .returning("id")
            .insert(config.table_prefix + table, data);
        qb.release();
        return response;
    },

    common_updateDetails: async (condition, data, table) => {
        let qb = await pool.get_connection();
        let response = await qb
            .set(data)
            .where(condition)
            .update(config.table_prefix + table);
        qb.release();
        return response;
    },

    make_sequential_no: async (pre) => {
        let qb = await pool.get_connection();
        let response = "";
        switch (pre) {
            case "CTR":
                response = await qb
                    .select("category_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "categories");
                break;
            case "TAG":
                response = await qb
                    .select("tag_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "tags");
                break;
            case "SBR":
                response = await qb
                    .select("subs_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "subscribers");
                break;
            case "ADS":
                response = await qb
                    .select("ads_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "ads");
                break;
            case "PST":
                response = await qb
                    .select("post_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "posts");
                break;
            case "USR":
                response = await qb
                    .select("user_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "users");
                break;
            case "SCTR":
                response = await qb
                    .select("sub_category_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "sub_categories");
                break;
            case "PHT":
                response = await qb
                    .select("photo_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "photos");
                break;
            case "VDO":
                response = await qb
                    .select("video_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "videos");
                break;
            case "SCL":
                response = await qb
                    .select("social_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "socials");
                break;
            case "PKG":
                response = await qb
                    .select("package_no")
                    .order_by("id", "desc")
                    .limit(1)
                    .get(config.table_prefix + "packages");
                break;
        }
        qb.release();
        let numberPart = 1001;
        if (response[0]?.category_no) {
            numberPart = parseInt(response[0].category_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.tag_no) {
            numberPart = parseInt(response[0].tag_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.subs_no) {
            numberPart = parseInt(response[0].subs_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.ads_no) {
            numberPart = parseInt(response[0].ads_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.package_no) {
            numberPart = parseInt(response[0].package_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.post_no) {
            numberPart = parseInt(response[0].post_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.user_no) {
            numberPart = parseInt(response[0].user_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.sub_category_no) {
            numberPart =
                parseInt(response[0].sub_category_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.photo_no) {
            numberPart = parseInt(response[0].photo_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.video_no) {
            numberPart = parseInt(response[0].video_no.match(/\d+/)[0]) + 1;
        }
        if (response[0]?.social_no) {
            numberPart = parseInt(response[0].social_no.match(/\d+/)[0]) + 1;
        }

        return numberPart;
    },

    common_select_list: async (
        condition,
        date_condition,
        limit,
        table,
        search
    ) => {
        let dbtable = config.table_prefix + table;
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (Object.keys(search).length) {
            let date_like_search_str =
                await helpers.get_conditional_or_like_string(search);
            if (final_cond == " where ") {
                final_cond = final_cond + date_like_search_str;
            } else {
                final_cond = final_cond + " and " + date_like_search_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query;
        if (Object.keys(limit).length) {
            query =
                "select * from " +
                dbtable +
                final_cond +
                " ORDER BY id DESC LIMIT " +
                limit.perpage +
                " OFFSET " +
                limit.start;
        } else {
            query =
                "select * from " + dbtable + final_cond + " ORDER BY id DESC";
        }

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response;
    },

    make_order_number: async (pre) => {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        let str = pre;
        str +=
            randomString(2, 1) +
            month +
            randomString(3, 1) +
            day +
            randomString(2, 1);
        return str;
    },

    make_referral_code: async (pre) => {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        let str = pre;
        str +=
            randomString(2, 1) +
            month +
            randomString(3, 1) +
            day +
            randomString(2, 1);
        return str;
    },

    get_and_conditional_string: async (obj) => {
        var output_string = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " = '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1;
    },

    get_or_conditional_string: async (obj) => {
        var output_string = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "or " + key + " = '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1;
    },

    get_date_between_condition: async (from_date, to_date, db_date_field) => {
        return (
            "DATE(" +
            db_date_field +
            ") BETWEEN '" +
            from_date +
            "' AND '" +
            to_date +
            "'"
        );
    },

    get_greater_than_equal_string: async (obj) => {
        var output_string = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " >= '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1;
    },

    get_less_than_equal_string: async (obj) => {
        var output_string = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " <= '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1;
    },

    get_in_condition: async (key, value) => {
        if (!key || !value) {
            return "";
        }
        const valueArray = value.split(",").map((item) => item.trim());
        const valueCondition = valueArray.map((item) => `'${item}'`).join(",");
        return `${key} IN (${valueCondition})`;
    },

    get_conditional_and_like_string: async (obj) => {
        var output_string = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += " and " + key + " LIKE '%" + obj[key] + "%'";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(0).join(" ");
        return output_string1;
    },

    get_conditional_or_like_string: async (obj) => {
        var output_string = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "or " + key + " LIKE '%" + obj[key] + "%' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");
        return output_string1;
    },

    get_referrer_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("full_name")
            .where({ id: id })
            .get(config.table_prefix + "referrers");
        qb.release();

        if (response[0]) {
            return response[0].full_name;
        } else {
            return "";
        }
    },

    // pushNotification: async (
    //     gcmid,
    //     title,
    //     message,
    //     url_,
    //     type,
    //     payload,
    //     user
    // ) => {
    //     let apiKey = "OTk2NjE4OWItOWJhOC00MTNhLWJlYTktMDczOWQyZTBjN2I0";
    //     let url = "https://onesignal.com/api/v1/notifications";

    //     let content = { en: message };
    //     let headings = { en: title };

    //     let fields = JSON.stringify({
    //         include_player_ids: [gcmid],
    //         app_id: "4ca5a703-bb3d-4504-9a04-14df43d69cde",
    //         body: message,
    //         headings: headings,
    //         contents: content,
    //         title: title,
    //         small_icon: "",
    //         large_icon: "",
    //         content_available: true,
    //         data: {
    //             title: title,
    //             message: message,
    //             type: type,
    //             payload: payload,
    //         },
    //     });

    //     function makeRequest(res_data, p_url, apiKey) {
    //         try {
    //             const config = {
    //                 method: "post",
    //                 data: res_data,
    //                 url: p_url,
    //                 headers: {
    //                     Authorization: "Basic " + apiKey,
    //                     "Content-Type": "application/json",
    //                 },
    //             };

    //             let res = axios(config);
    //             console.log(res);
    //             return res.data;
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     makeRequest(fields, url, apiKey);
    // },

    // pushNotificationtesting: async (
    //     gcmid = "6d422d5d-2dbf-4d44-a21d-6a3eb3594a31",
    //     title = "testing-title",
    //     message = "testing message",
    //     url_ = "testing url",
    //     type = "testing type",
    //     payload = { abc: "payload object" },
    //     user = "test user"
    // ) => {
    //     let apiKey = "MGRhMzM5N2YtNWFkYS00NjgxLTk2OTQtMDBiZjMyNTgzM2Nj";
    //     url = "https://onesignal.com/api/v1/notifications";

    //     let content = { en: message };
    //     let headings = { en: title };

    //     let fields = JSON.stringify({
    //         include_player_ids: [gcmid],
    //         app_id: "3fcfcc5c-70f4-4645-8035-1b71a790e4ce",
    //         body: message,
    //         headings: headings,
    //         contents: content,
    //         title: "title",
    //         small_icon: "",
    //         large_icon: "",
    //         content_available: true,
    //         data: {
    //             title: title,
    //             message: message,
    //             type: type,
    //             payload: payload,
    //         },
    //     });

    //     function makeRequest(res_data, p_url, apiKey) {
    //         try {
    //             const config = {
    //                 method: "post",
    //                 data: res_data,
    //                 url: p_url,
    //                 headers: {
    //                     Authorization: "Basic " + apiKey,
    //                     "Content-Type": "application/json",
    //                 },
    //             };

    //             let res = axios(config);

    //             return res.data;
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     makeRequest(fields, url, apiKey);
    // },
};
module.exports = helpers;
