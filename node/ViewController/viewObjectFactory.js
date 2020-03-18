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