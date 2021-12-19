var conditions = ["New", "Good", "Fair", "Poor", "Destroyed", "Lost"]

function condition_to_word(condition){
    return conditions[condition]
}

function word_to_condition(word){
    switch(word){
        case "New":
            return 0
        case "Good":
            return 1
        case "Fair":
            return 2
        case "Poor":
            return 3
        case "Destroyed":
            return 4
        case "Lost":
            return 5
        default:
            return -1
    }
}

//returns a list of abstract textbooks that match a given word
function abstractTextbookSearch(currentWord, abstractTextbooks){
    var stringSimilarity = require("string-similarity")
    //keyWords = returnKeyWords(currentWord)
    //console.log(keyWords)
    currentWord = currentWord.toLowerCase()
    var similarList = []
    for(var i = 0; i < abstractTextbooks.length; i++){
        //abstractKeyWords = returnKeyWords(abstractTextbooks[i].title)
        var textbookTitle = abstractTextbooks[i].title.toLowerCase()
        var similarity = stringSimilarity.compareTwoStrings(currentWord, textbookTitle)
        if(similarity > 0.8 || textbookTitle.includes(currentWord)){
            similarList.push(abstractTextbooks[i])
        } 
        
    }
    return similarList
}

function courseSearch(currentTeacher, courses, displayIdentical = false){
    var similarCourses = []
    var identicalTracker = {}
    currentTeacher = currentTeacher.toLowerCase()
    var teacherWords = currentTeacher.split(' ')
    for(var i = 0; i < courses.length; i++){
        var courseTeacher = courses[i].teacher.toLowerCase()
        var teacherCheck = true
        for(var x = 0; x < teacherWords.length; x++){
            if(!courseTeacher.includes(teacherWords[x])){
                teacherCheck = false
                break
            }
        }
        if(teacherCheck){
            if(displayIdentical){
                courses[i].id = similarCourses.length + 1
                similarCourses.push(courses[i])
            } else {
                if(identicalTracker[courses[i].name] != null){
                    if(similarCourses[identicalTracker[courses[i].name]].teacher === courses[i].teacher){
                        similarCourses[identicalTracker[courses[i].name]].amount += 1
                    }
                } else{
                    courses[i].amount = 1
                    courses[i].id = similarCourses.length + 1
                    similarCourses.push(courses[i])
                    identicalTracker[courses[i].name] = similarCourses.length - 1
                }
            }
        }
    }

    return similarCourses
}

function studentSearch(currentName, names){
    var similarNames = []
    var keyWords = currentName.toLowerCase().split(' ')
    for(var i = 0; i < names.length; i++){
        var similarCheck = true
        for(var x = 0; x < keyWords.length; x++){
            if(!names[i].name.toLowerCase().includes(keyWords[x])){
                similarCheck = false
                break
            }
        }
        if(similarCheck){
            similarNames.push(names[i])
        }
    }
    return similarNames
}

// converts time to a more readable format, i.e. 5 seconds ago, or 21 minutes ago, etc...
// disgusting amount of if statements but whatever
function timeConversion(time){
    var from_time = new Date(time)
    var current_time = new Date()
    var time_difference = current_time.getTime() - from_time
    var seconds = Math.round((time_difference) / 1000)
    if(seconds < 0){
        return "Just now..."
    }
    if(seconds < 60){
        if(seconds == 1){
            return seconds.toString() + " second ago..."
        }
        return seconds.toString() + " seconds ago..."
    } 
    var minutes = Math.round((time_difference) / 60000)
    if(minutes < 60){
        if(minutes == 1){
            return minutes.toString() + " minute ago..."
        }
        return minutes.toString() + " minutes ago..."
    } 
    var hours = Math.round((time_difference) / (60000 * 60))
    if(hours < 24){
        if(hours == 1){
            return hours.toString() + " hour ago..."
        }
        return hours.toString() + " hours ago..."
    }

    var days = Math.round((time_difference) / (60000 * 60 * 24))
    if(days == 1){
        return days.toString() + " day ago..."
    }
    return days.toString() + " days ago..."
    
}

function textbooksToOrder(textbooks){
    var textbookList = [];
    for(var i = 0; i < textbooks.length; i++){
        if(textbooks[i].needed != 0 && textbooks[i].amount != 0 && !textbooks[i].title.includes("Placeholder")){
            if(textbooks[i].amount / textbooks[i].needed <= 1.05){
                textbookList.push(textbooks[i])
            }
        } 
    }    
    return textbookList
}

function permLevel(role){
    switch(role){
        case "superadmin":
            return 0;
        case "admin":
            return 1;
        case "teacher":
            return 2
        case "student":
            return 3
        default:
            return 4
    }
}

export {permLevel, condition_to_word, word_to_condition, abstractTextbookSearch, courseSearch, timeConversion, studentSearch, textbooksToOrder} 