(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
    Purpose: Store and retrieve data from remote API
*/

const APIObject = {

}

/*
    Purpose: Make GET request to API to retrieve data
*/
APIObject.getTypes = () => {
    return fetch("http://localhost:8088/types")
        .then(response => response.json());
}

/*
    Purpose: Retrieves all product objects from API
*/
APIObject.getProducts = () => {
    return fetch("http://localhost:8088/inventory")
    .then(response => response.json());
}

/*
    Purpose: POSTs (creates) a new product in the API
*/
APIObject.saveProduct = (product) => {
    return fetch("http://localhost:8088/inventory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

module.exports = APIObject



},{}],2:[function(require,module,exports){
const DataManager = require("./data/DataManager")
const renderProductList = require("./product/ProductList")
const renderNavBar = require("./nav/NavBar")
const renderForm = require("./product/ProductForm")


const saveProduct = (product) => {
    // Save the product to the API
    DataManager.saveProduct(product)
    .then(() => {
        renderProductList(null)
    })
}

renderNavBar().then(html => {
    document.querySelector("#navigation").innerHTML = html
    document.querySelector("#navbar").addEventListener("click", event => {
        const typeClickedOn = parseInt(event.target.id.split("--")[1])
        renderProductList(typeClickedOn)
    })
})
// renderProductList()
renderForm("#container", saveProduct)




},{"./data/DataManager":1,"./nav/NavBar":3,"./product/ProductForm":4,"./product/ProductList":5}],3:[function(require,module,exports){
const DataManager = require("../data/DataManager")

function renderNavBar () {
    return DataManager.getTypes().then(types => {
        let navHTML = "<nav id=\"navbar\">"

        types.forEach(type => {
            navHTML += `<a id="type--${type.id}" href="#">${type.description}</a>`
        })

        navHTML += "<a href=\"#\">Create Product</a>"
        navHTML += "</nav>"

        return navHTML
    })
}

module.exports = renderNavBar

},{"../data/DataManager":1}],4:[function(require,module,exports){
const DataManager = require("../data/DataManager")
const renderProductList = require("./ProductList")

let instructions = null

/*
    Purpose: Adds the event listener to the Save Product button
        and construct the object to be saved to the API when the
        button is clicked
*/
const addListener = () => {
    document.querySelector(".btn--saveProduct").addEventListener("click", () => {
        const product = {}
        product.name = document.querySelector("#productName").value
        product.description = document.querySelector("#productDescription").value
        product.price = parseFloat(document.querySelector("#productPrice").value)
        product.quantity = parseInt(document.querySelector("#productQuantity").value)
        product.type = parseInt(document.querySelector("#productType").value)

        console.log(product)

        DataManager.saveProduct(product)
            .then(() =>
                renderProductList(null)
            )
    })
}


/*
    Purpose: Build the product form component
    Arguments: types (string) - The option strings to put in the select
*/
const buildFormTemplate = (types) => {
    return `
        <fieldset>
            <label for="productName">Product name:</label>
            <input required type="text" name="productName" id="productName">
        </fieldset>
        <fieldset>
            <label for="productDescription">Description:</label>
            <input required type="text" name="productDescription" id="productDescription">
        </fieldset>
        <fieldset>
            <label for="productPrice">Price:</label>
            <input required type="number" name="productPrice" id="productPrice">
        </fieldset>
        <fieldset>
            <label for="productQuantity">Quantity:</label>
            <input required type="number" name="productQuantity" id="productQuantity">
        </fieldset>
        <fieldset>
            <label for="productType">Category:</label>
            <select required name="productType" id="productType">
            ${types.join("")}
            </select>
        </fieldset>
        <button class="btn btn--saveProduct">Save Product</button>
    `
}

/*
    Purpose: Renders the form component to the target element
    Arguments: targetElement (string) - Query selector string for HTML element
*/
const renderForm = (targetElement, saveInstructions) => {
    instructions = saveInstructions
    return DataManager.getTypes()
        .then(types => {
            // Build options from the product types
            const options = types.map(type => {
                return `<option value="${type.id}">${type.description}</option>`
            })

            // Render the form to the DOM
            document.querySelector(targetElement).innerHTML = buildFormTemplate(options)

            // Now that it's on the DOM, add the event listener
            addListener()
        })
}

module.exports = renderForm
},{"../data/DataManager":1,"./ProductList":5}],5:[function(require,module,exports){
const DataManager = require("../data/DataManager")

function renderProductList(productTypeId) {
    DataManager.getProducts()
        .then((products) => {
            const container = document.querySelector("#container")
            container.textContent = ""
            if (productTypeId === null) {
                products.forEach(product => {
                    container.innerHTML += `<p>${product.name} $${product.price}</p>`
                })
            }
            else {
                // Filter all products to the ones that have the correct type
                const filteredProducts = products.filter(product => {
                    return product.type === productTypeId
                })

                // Display only the products that are of the correct type
                filteredProducts.forEach(product => {
                    container.innerHTML += `<p>${product.name} $${product.price}</p>`
                })
            }
        })
}

module.exports = renderProductList
},{"../data/DataManager":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEvRGF0YU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL25hdi9OYXZCYXIuanMiLCIuLi9zY3JpcHRzL3Byb2R1Y3QvUHJvZHVjdEZvcm0uanMiLCIuLi9zY3JpcHRzL3Byb2R1Y3QvUHJvZHVjdExpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxuICAgIFB1cnBvc2U6IFN0b3JlIGFuZCByZXRyaWV2ZSBkYXRhIGZyb20gcmVtb3RlIEFQSVxuKi9cblxuY29uc3QgQVBJT2JqZWN0ID0ge1xuXG59XG5cbi8qXG4gICAgUHVycG9zZTogTWFrZSBHRVQgcmVxdWVzdCB0byBBUEkgdG8gcmV0cmlldmUgZGF0YVxuKi9cbkFQSU9iamVjdC5nZXRUeXBlcyA9ICgpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvdHlwZXNcIilcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKTtcbn1cblxuLypcbiAgICBQdXJwb3NlOiBSZXRyaWV2ZXMgYWxsIHByb2R1Y3Qgb2JqZWN0cyBmcm9tIEFQSVxuKi9cbkFQSU9iamVjdC5nZXRQcm9kdWN0cyA9ICgpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvaW52ZW50b3J5XCIpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKTtcbn1cblxuLypcbiAgICBQdXJwb3NlOiBQT1NUcyAoY3JlYXRlcykgYSBuZXcgcHJvZHVjdCBpbiB0aGUgQVBJXG4qL1xuQVBJT2JqZWN0LnNhdmVQcm9kdWN0ID0gKHByb2R1Y3QpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvaW52ZW50b3J5XCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJvZHVjdClcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBUElPYmplY3RcblxuXG4iLCJjb25zdCBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL2RhdGEvRGF0YU1hbmFnZXJcIilcbmNvbnN0IHJlbmRlclByb2R1Y3RMaXN0ID0gcmVxdWlyZShcIi4vcHJvZHVjdC9Qcm9kdWN0TGlzdFwiKVxuY29uc3QgcmVuZGVyTmF2QmFyID0gcmVxdWlyZShcIi4vbmF2L05hdkJhclwiKVxuY29uc3QgcmVuZGVyRm9ybSA9IHJlcXVpcmUoXCIuL3Byb2R1Y3QvUHJvZHVjdEZvcm1cIilcblxuXG5jb25zdCBzYXZlUHJvZHVjdCA9IChwcm9kdWN0KSA9PiB7XG4gICAgLy8gU2F2ZSB0aGUgcHJvZHVjdCB0byB0aGUgQVBJXG4gICAgRGF0YU1hbmFnZXIuc2F2ZVByb2R1Y3QocHJvZHVjdClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHJlbmRlclByb2R1Y3RMaXN0KG51bGwpXG4gICAgfSlcbn1cblxucmVuZGVyTmF2QmFyKCkudGhlbihodG1sID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hdmlnYXRpb25cIikuaW5uZXJIVE1MID0gaHRtbFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmF2YmFyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHR5cGVDbGlja2VkT24gPSBwYXJzZUludChldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKVsxXSlcbiAgICAgICAgcmVuZGVyUHJvZHVjdExpc3QodHlwZUNsaWNrZWRPbilcbiAgICB9KVxufSlcbi8vIHJlbmRlclByb2R1Y3RMaXN0KClcbnJlbmRlckZvcm0oXCIjY29udGFpbmVyXCIsIHNhdmVQcm9kdWN0KVxuXG5cblxuIiwiY29uc3QgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi4vZGF0YS9EYXRhTWFuYWdlclwiKVxuXG5mdW5jdGlvbiByZW5kZXJOYXZCYXIgKCkge1xuICAgIHJldHVybiBEYXRhTWFuYWdlci5nZXRUeXBlcygpLnRoZW4odHlwZXMgPT4ge1xuICAgICAgICBsZXQgbmF2SFRNTCA9IFwiPG5hdiBpZD1cXFwibmF2YmFyXFxcIj5cIlxuXG4gICAgICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBuYXZIVE1MICs9IGA8YSBpZD1cInR5cGUtLSR7dHlwZS5pZH1cIiBocmVmPVwiI1wiPiR7dHlwZS5kZXNjcmlwdGlvbn08L2E+YFxuICAgICAgICB9KVxuXG4gICAgICAgIG5hdkhUTUwgKz0gXCI8YSBocmVmPVxcXCIjXFxcIj5DcmVhdGUgUHJvZHVjdDwvYT5cIlxuICAgICAgICBuYXZIVE1MICs9IFwiPC9uYXY+XCJcblxuICAgICAgICByZXR1cm4gbmF2SFRNTFxuICAgIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyTmF2QmFyXG4iLCJjb25zdCBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuLi9kYXRhL0RhdGFNYW5hZ2VyXCIpXG5jb25zdCByZW5kZXJQcm9kdWN0TGlzdCA9IHJlcXVpcmUoXCIuL1Byb2R1Y3RMaXN0XCIpXG5cbmxldCBpbnN0cnVjdGlvbnMgPSBudWxsXG5cbi8qXG4gICAgUHVycG9zZTogQWRkcyB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIFNhdmUgUHJvZHVjdCBidXR0b25cbiAgICAgICAgYW5kIGNvbnN0cnVjdCB0aGUgb2JqZWN0IHRvIGJlIHNhdmVkIHRvIHRoZSBBUEkgd2hlbiB0aGVcbiAgICAgICAgYnV0dG9uIGlzIGNsaWNrZWRcbiovXG5jb25zdCBhZGRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi0tc2F2ZVByb2R1Y3RcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IHt9XG4gICAgICAgIHByb2R1Y3QubmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZHVjdE5hbWVcIikudmFsdWVcbiAgICAgICAgcHJvZHVjdC5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZHVjdERlc2NyaXB0aW9uXCIpLnZhbHVlXG4gICAgICAgIHByb2R1Y3QucHJpY2UgPSBwYXJzZUZsb2F0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZHVjdFByaWNlXCIpLnZhbHVlKVxuICAgICAgICBwcm9kdWN0LnF1YW50aXR5ID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9kdWN0UXVhbnRpdHlcIikudmFsdWUpXG4gICAgICAgIHByb2R1Y3QudHlwZSA9IHBhcnNlSW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZHVjdFR5cGVcIikudmFsdWUpXG5cbiAgICAgICAgY29uc29sZS5sb2cocHJvZHVjdClcblxuICAgICAgICBEYXRhTWFuYWdlci5zYXZlUHJvZHVjdChwcm9kdWN0KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICByZW5kZXJQcm9kdWN0TGlzdChudWxsKVxuICAgICAgICAgICAgKVxuICAgIH0pXG59XG5cblxuLypcbiAgICBQdXJwb3NlOiBCdWlsZCB0aGUgcHJvZHVjdCBmb3JtIGNvbXBvbmVudFxuICAgIEFyZ3VtZW50czogdHlwZXMgKHN0cmluZykgLSBUaGUgb3B0aW9uIHN0cmluZ3MgdG8gcHV0IGluIHRoZSBzZWxlY3RcbiovXG5jb25zdCBidWlsZEZvcm1UZW1wbGF0ZSA9ICh0eXBlcykgPT4ge1xuICAgIHJldHVybiBgXG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwcm9kdWN0TmFtZVwiPlByb2R1Y3QgbmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInByb2R1Y3ROYW1lXCIgaWQ9XCJwcm9kdWN0TmFtZVwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvZHVjdERlc2NyaXB0aW9uXCI+RGVzY3JpcHRpb246PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCByZXF1aXJlZCB0eXBlPVwidGV4dFwiIG5hbWU9XCJwcm9kdWN0RGVzY3JpcHRpb25cIiBpZD1cInByb2R1Y3REZXNjcmlwdGlvblwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvZHVjdFByaWNlXCI+UHJpY2U6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCByZXF1aXJlZCB0eXBlPVwibnVtYmVyXCIgbmFtZT1cInByb2R1Y3RQcmljZVwiIGlkPVwicHJvZHVjdFByaWNlXCI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwcm9kdWN0UXVhbnRpdHlcIj5RdWFudGl0eTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwicHJvZHVjdFF1YW50aXR5XCIgaWQ9XCJwcm9kdWN0UXVhbnRpdHlcIj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInByb2R1Y3RUeXBlXCI+Q2F0ZWdvcnk6PC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3QgcmVxdWlyZWQgbmFtZT1cInByb2R1Y3RUeXBlXCIgaWQ9XCJwcm9kdWN0VHlwZVwiPlxuICAgICAgICAgICAgJHt0eXBlcy5qb2luKFwiXCIpfVxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLS1zYXZlUHJvZHVjdFwiPlNhdmUgUHJvZHVjdDwvYnV0dG9uPlxuICAgIGBcbn1cblxuLypcbiAgICBQdXJwb3NlOiBSZW5kZXJzIHRoZSBmb3JtIGNvbXBvbmVudCB0byB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAgICBBcmd1bWVudHM6IHRhcmdldEVsZW1lbnQgKHN0cmluZykgLSBRdWVyeSBzZWxlY3RvciBzdHJpbmcgZm9yIEhUTUwgZWxlbWVudFxuKi9cbmNvbnN0IHJlbmRlckZvcm0gPSAodGFyZ2V0RWxlbWVudCwgc2F2ZUluc3RydWN0aW9ucykgPT4ge1xuICAgIGluc3RydWN0aW9ucyA9IHNhdmVJbnN0cnVjdGlvbnNcbiAgICByZXR1cm4gRGF0YU1hbmFnZXIuZ2V0VHlwZXMoKVxuICAgICAgICAudGhlbih0eXBlcyA9PiB7XG4gICAgICAgICAgICAvLyBCdWlsZCBvcHRpb25zIGZyb20gdGhlIHByb2R1Y3QgdHlwZXNcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0eXBlcy5tYXAodHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8b3B0aW9uIHZhbHVlPVwiJHt0eXBlLmlkfVwiPiR7dHlwZS5kZXNjcmlwdGlvbn08L29wdGlvbj5gXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyBSZW5kZXIgdGhlIGZvcm0gdG8gdGhlIERPTVxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRFbGVtZW50KS5pbm5lckhUTUwgPSBidWlsZEZvcm1UZW1wbGF0ZShvcHRpb25zKVxuXG4gICAgICAgICAgICAvLyBOb3cgdGhhdCBpdCdzIG9uIHRoZSBET00sIGFkZCB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIGFkZExpc3RlbmVyKClcbiAgICAgICAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJGb3JtIiwiY29uc3QgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi4vZGF0YS9EYXRhTWFuYWdlclwiKVxuXG5mdW5jdGlvbiByZW5kZXJQcm9kdWN0TGlzdChwcm9kdWN0VHlwZUlkKSB7XG4gICAgRGF0YU1hbmFnZXIuZ2V0UHJvZHVjdHMoKVxuICAgICAgICAudGhlbigocHJvZHVjdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpXG4gICAgICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSBcIlwiXG4gICAgICAgICAgICBpZiAocHJvZHVjdFR5cGVJZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxwPiR7cHJvZHVjdC5uYW1lfSAkJHtwcm9kdWN0LnByaWNlfTwvcD5gXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBhbGwgcHJvZHVjdHMgdG8gdGhlIG9uZXMgdGhhdCBoYXZlIHRoZSBjb3JyZWN0IHR5cGVcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZFByb2R1Y3RzID0gcHJvZHVjdHMuZmlsdGVyKHByb2R1Y3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdC50eXBlID09PSBwcm9kdWN0VHlwZUlkXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgb25seSB0aGUgcHJvZHVjdHMgdGhhdCBhcmUgb2YgdGhlIGNvcnJlY3QgdHlwZVxuICAgICAgICAgICAgICAgIGZpbHRlcmVkUHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCArPSBgPHA+JHtwcm9kdWN0Lm5hbWV9ICQke3Byb2R1Y3QucHJpY2V9PC9wPmBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlclByb2R1Y3RMaXN0Il19
