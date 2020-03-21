let sectionDatabase = {
    2.1:   {keywords: ['vidensdeling', 'feed-up', 'feed-forward'].toString()},
    2.2:   {keywords: ['studier', 'evaluering', 'formativ', 'summativ']},
    2.3:   {keywords: ['metoder', 'active recall', 'spaced repetition']},
    2.4:   {keywords: ['SOTA', 'classkick', 'kahoot!']}
};


/* console.log(sectionDatabase[0].content.keywords); */

// let afsnitMap = new Map();
// afsnitMap.set(2.1, ['vidensdeling', 'feed-up', 'feed-forward']);
// afsnitMap.set(2.2, ['studier', 'evaluering', 'formativ', 'summativ']);
// afsnitMap.set(2.3, ['metoder', 'active recall', 'spaced repetition']);
// afsnitMap.set(2.4, ['SOTA', 'classkick', 'kahoot!']);

// afsnitMap.get(2.1);
// console.log(afsnitMap.get(2.1));
// console.log(afsnitMap.get(2.2));
// console.log(afsnitMap.get(2.3));
// console.log(afsnitMap.get(2.4));

let afsnit = {
    2.1: {keyword: 'hej med dig'} 
}

console.log(sectionDatabase[2.1].keywords);
