# D3 notes


## About
**D3.js** is a JavaScript library for manipulating documents based on data. **D3** helps  bring data to life using **HTML, SVG, and CSS**.

*  **D3’s** emphasis on web standards gives you the full capabilities of modern browsers without tying yourself to a proprietary framework, combining powerful visualization components and a data-driven approach to DOM manipulation.

* **D3** stands for data driven documents.

* **D3** allows you to bind arbitrary data to a **Document Object Model (DOM)**, and then apply data-driven transformations to the document. For example, you can use **D3** to generate an **HTML** table from an array of numbers. Or, use the same data to create an interactive **SVG** bar chart with smooth transitions and interaction.

* With minimal overhead, **D3** is extremely fast, supporting large datasets and dynamic behaviors for interaction and animation. **D3’s** functional style allows code reuse 

## Selections

**D3** uses a declarative approach for operating on a set of **DOM** nodes , called **selections**.

```
var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++) {
  var paragraph = paragraphs.item(i);
  paragraph.style.setProperty("color", "white", null);
}
```
The above example and the one below are the same.


```
d3.selectAll("p").style("color", "white");
```

**NOTE**:Individual nodes can also be selected (using selectors corresponding to the same.)

## Dynamic properties (functions as properties of nodes)

Styles, attributes, and other properties can be specified as functions of data in **D3**, not just simple constants. 

Example:
To alternate shades of gray for even and odd nodes:
```
d3.selectAll("p").style("color", function(d, i) {
  return i % 2 ? "#fff" : "#eee";
});
```

### Computed properties often refer to bound data.

* Data is specified as an array of values, and each value is passed as the first argument (d) to selection functions. 
* With the default join-by-index, the first element in the data array is passed to the first node in the selection, the second element to the second node, and so on. 

For example, if you bind an array of numbers to paragraph elements, you can use these numbers to compute dynamic font sizes:

```javascript
d3.selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .style("font-size", function(d) { return d + "px"; });
```
**IMPORTANT**
**Once the data has been bound to the document, you can omit the data operator; D3 will retrieve the previously-bound data. This allows you to recompute properties without rebinding.**

## Enter and Exit 

>Using **D3’s enter and exit selections,** you can create new nodes for incoming data and remove outgoing nodes that are no longer needed.

When data is bound to a selection, each element in the data array is paired with the corresponding node in the selection. 

**If there are fewer nodes than data, the extra data elements form the enter selection, which you can instantiate by appending to the enter selection.** For example:


```
d3.select("body") // selects body
  .selectAll("p")    // selects all the 'p' elements inside body
  .data([4, 8, 15, 16, 23, 42]) //pairs all nodes with given array data, in case of less nodes, extra data elements form the enter selection.
  .enter().append("p") //selecting the enter selection for the extra elements, appending 'p' nodes to it , and applying text function to each node.
    .text(function(d) { return "I’m number " + d + "!"; });
    
```
**Updating nodes are the default selection—the result of the data operator. Thus, if you forget about the enter and exit selections, you will automatically select only the elements for which there exists corresponding data.**


A common pattern is to break the initial selection into three parts: 

* the updating nodes to modify, 
* the entering nodes to add, 
* and the exiting nodes to remove.

```
// Update…
var p = d3.select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .text(function(d) { return d; });

// Enter…
p.enter().append("p")
    .text(function(d) { return d; });

// Exit…
p.exit().remove();

```

By handling these three cases separately, you specify precisely which operations run on which nodes. This improves performance and offers greater control over transitions. 

* **D3** lets you transform documents based on data; this includes both creating and destroying elements.

*  **D3** allows you to change an existing document in response to user interaction, animation over time, or even asynchronous notification from a third-party.
 
>  A hybrid approach is also possible, where the document is initially rendered on the server, and updated on the client via **D3**.

## Transitions

 
**D3’**s focus on transformation extends naturally to animated transitions.

 Transitions gradually interpolate styles and attributes over time. Tweening can be controlled via easing functions such as `“elastic”`, `“cubic-in-out”` and `“linear”`. 
 
 **D3’s** interpolators support both primitives, such as numbers and numbers embedded within strings (font sizes, path data, etc.), and compound values.

  You can even extend **D3’s** interpolator registry to support complex properties and data structures.
  
For example, to fade the background of the page to black:
  
```  
d3.select("body").transition()
    .style("background-color", "black");
```   
  Or, to resize circles in a symbol map with a staggered delay:
    
```
d3.selectAll("circle").transition()
    .duration(750)
    .delay(function(d, i) { return i * 10; })
    .attr("r", function(d) { return Math.sqrt(d * scale); });
```
**By modifying only the attributes that actually change**, D3 reduces overhead and allows greater graphical complexity at high frame rates. 

**D3** also allows sequencing of complex transitions via events. And, you can still use CSS3 transitions; **D3** does not replace the browser’s toolbox, but exposes it in a way that is easier to use.


## Transformation, not Representation

D3 does not introduce a new visual representation.

D3 does not introduce a new visual representation. Unlike Processing or Protovis, D3’s vocabulary of graphical marks comes directly from web standards: HTML, SVG, and CSS. For example, you can create SVG elements using D3 and style them with external stylesheets. You can use composite filter effects, dashed strokes and clipping. If browser vendors introduce new features tomorrow, you’ll be able to use them immediately—no toolkit update required.

Best of all, D3 is easy to debug using the browser’s built-in element inspector: the nodes that you manipulate with D3 are exactly those that the browser understands natively.

