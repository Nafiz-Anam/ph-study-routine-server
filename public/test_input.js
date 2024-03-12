const sampleInput = {
    weeklySchedule: [
        {
            day: "Monday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "10:00",
                    endTime: "12:00",
                    subject: "match",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Tuesday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "08:00",
                    endTime: "10:00",
                    subject: "machine learning",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "14:00",
                    endTime: "16:00",
                    subject: "algorithm",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Wednesday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "10:00",
                    endTime: "12:00",
                    subject: "algorithm",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Thursday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "08:00",
                    endTime: "10:00",
                    subject: "math",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "14:00",
                    endTime: "16:00",
                    subject: "machine learning",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Friday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "10:00",
                    endTime: "12:00",
                    subject: "math",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "14:00",
                    endTime: "16:00",
                    subject: "algorithm",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Saturday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "07:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "10:00",
                    endTime: "19:00",
                    subject: "agile tech.",
                    location: "",
                },
                {
                    reason: "other",
                    startTime: "10:00",
                    endTime: "19:00",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "other",
                    startTime: "19:15",
                    endTime: "21:00",
                    subject: "sleep",
                    location: "",
                },
            ],
        },
        {
            day: "Sunday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "07:30",
                    subject: "rest",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "10:00",
                    endTime: "19:00",
                    subject: "agile tech.",
                    location: "",
                },
                {
                    reason: "other",
                    startTime: "19:15",
                    endTime: "21:00",
                    subject: "rest",
                    location: "",
                },
            ],
        },
    ],
};

const sampleWrongInput = {
    weeklySchedule: [
        {
            day: "Monday",
            timeBlocks: [],
        },
        {
            day: "Tuesday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "08:00",
                    endTime: "10:00",
                    subject: "machine learning",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "14:00",
                    endTime: "16:00",
                    subject: "algorithm",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Wednesday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "10:00",
                    endTime: "12:00",
                    subject: "algorithm",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Thursday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "08:00",
                    endTime: "10:00",
                    subject: "math",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "14:00",
                    endTime: "16:00",
                    subject: "machine learning",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Friday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "06:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "10:00",
                    endTime: "12:00",
                    subject: "math",
                    location: "",
                },
                {
                    reason: "class",
                    startTime: "14:00",
                    endTime: "16:00",
                    subject: "algorithm",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "18:00",
                    endTime: "22:00",
                    subject: "agile tech.",
                    location: "",
                },
            ],
        },
        {
            day: "Saturday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "07:30",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "10:00",
                    endTime: "19:00",
                    subject: "agile tech.",
                    location: "",
                },
                {
                    reason: "other",
                    startTime: "10:00",
                    endTime: "19:00",
                    subject: "sleep",
                    location: "",
                },
                {
                    reason: "other",
                    startTime: "19:15",
                    endTime: "21:00",
                    subject: "sleep",
                    location: "",
                },
            ],
        },
        {
            day: "Sunday",
            timeBlocks: [
                {
                    reason: "other",
                    startTime: "02:00",
                    endTime: "07:30",
                    subject: "rest",
                    location: "",
                },
                {
                    reason: "work",
                    startTime: "10:00",
                    endTime: "19:00",
                    subject: "agile tech.",
                    location: "",
                },
                {
                    reason: "other",
                    startTime: "19:15",
                    endTime: "21:00",
                    subject: "rest",
                    location: "",
                },
            ],
        },
    ],
};

const todoInput = {
    todo: [
        {
            name: "math",
            timeNeeded: 120,
            priority: "high",
        },
        {
            name: "algorithms",
            timeNeeded: 180,
            priority: "medium",
        },
        {
            name: "english",
            timeNeeded: 120,
            priority: "low",
        },
        {
            name: "machine learning",
            timeNeeded: 120,
            priority: "medium",
        },
        {
            name: "catch-up math",
            timeNeeded: 120,
            priority: "medium",
        },
        {
            name: "catch-up algorithms",
            timeNeeded: 120,
            priority: "medium",
        },
        {
            name: "catch-up machine learning",
            timeNeeded: 120,
            priority: "medium",
        },
    ],
};

const wrongTodoInput = {
    todo: [
        {
            name: "",
            timeNeeded: 120,
            priority: "high",
        },
        {
            name: "algorithms",
            timeNeeded: 180,
            priority: "medium",
        },
        {
            name: "english",
            timeNeeded: 120,
            priority: "low",
        },
        {
            name: "machine learning",
            timeNeeded: 120,
            priority: "medium",
        },
        {
            name: "catch-up math",
            timeNeeded: 120,
            priority: "medium",
        },
        {
            name: "catch-up algorithms",
            timeNeeded: 120,
            priority: "medium",
        },
        {
            name: "catch-up machine learning",
            timeNeeded: 120,
            priority: "medium",
        },
    ],
};

module.exports = { sampleInput, sampleWrongInput, todoInput, wrongTodoInput };
