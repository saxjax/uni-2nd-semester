// create view objects

function element(content){
    
    let data = content;
    data.items = content.items;
    // depending on the content , populate the dataelement  

    // Render it
        return (
          <div>
              <div style="width:500px;height:100px;border:1px solid #000;">${content}</div>
            {/* {array} */}
          </div>
        );
      }

function elementList(elements){
    // Build an array of items
        let array = [];
        for(let i = 0; i < props.items.length; i++) {
          array.push(
            <Item key={i} item={elements.items[i]} />
          );
        }
    return a-list-of-elements-viewElement
}

//icon telling if an evaluation is createt for a section
//takes a bool  true->green  , false->red, color overrides true/false color
class EvalCreatetViewObject {
    constructor(color, bool) {  }
}

//a status view showing progress and amount of finished evaluations over total availlable evaluations
//takes pct(0-100), takenEvals, totalEvals
class StatusViewObject {
    constructor(pct,finishedEval,totalEval){

    }
}

//list of elements
//takes an array of any elements returns an array of viewObjects for displaying in a list
//takes styles to create different list types, (standard/timemachine)
class elementListViewObject{
    constructor(elements){

    }
}

// presents  sections, highlights keywords depending on users answers in evaluation tools
//displays red and green key to indicate whether a page contains keywords and if the keywords 
// are mmarked as known or unknown in users Evaluationlog.
class documentDisplayViewObject{
    constructor(Sections,keywords){

    }
}

//key symbol to indicate if a keyword is known or the user shuld be extra opmærksom
class keywordIndicatorViewObject{
    constructor(color, bool){
    }
}

