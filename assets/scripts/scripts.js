// Declared Variables
var wishListArray = [];
var searchResultsArray = [];

// Get API function for NYT best sellers
function getApi(){
    var requestUrlHardcoverNonFiction="https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=GXs6gx2gnZLiyA8GGEdALLBnQEC8Ak1w";
    
    // Fetch NYT Api
    fetch(requestUrlHardcoverNonFiction)
        .then(function (response) {
            return response.json();
            
        })
        .then (function (data){
            console.log(data);
            for (var i=0; i<5; i++){
                // Display img, title, synopsis, amazon link
            $("#bestSellerImg"+i).attr("src", data.results.books[i].book_image);
            $("#bestSellerTitle"+i).text(data.results.books[i].title);
            $("#bestSellerSynopsis"+i).text(data.results.books[i].description);
            $("#moreInfo"+i).attr("href", data.results.books[i].amazon_product_url);
            }    
        });
    };
    
$( document ).ready(function(){
    displayURLbyID("mainSection");
    getApi();
    

    // when the page loads, grab what is in the local storage and store it in the wishlist
    var wishlistItems =JSON.parse( localStorage.getItem("wishlist"));
  if (wishlistItems!=null){
    wishListArray=wishlistItems;

    renderWishlist();

  }
});


function googleBooksApi(){

    // selectedObject = null;
    displayURLbyID("searchresults");
    
    var searchInputAuthorSubstring = "";
    var searchInputTitleSubstring = "";

    if( $("#searchInputAuthor").val()){
        searchInputAuthorSubstring = "+inauthor:" + $("#searchInputAuthor").val();
    }
    if( $("#searchInputTitle").val()){
        searchInputTitleSubstring =  $("#searchInputTitle").val();
    }

    var requestGoogleBookspi = "https://www.googleapis.com/books/v1/volumes?q="+searchInputTitleSubstring + searchInputAuthorSubstring + "&key=AIzaSyAl-vJ09UrVHn5AE-KZ8HOqGiwx5UOqQ50";
    console.log(requestGoogleBookspi);

    fetch(requestGoogleBookspi)
        .then(function (response) {
            return response.json();
            
        })
        .then (function (data){
            console.log(data);
            searchResultsArray = [];
            var htmltable = "";

            for (var i=0; i<data.items.length; i++){

              var dataObject={
                  identifier:data.items[i].id,
                  title:data.items[i].volumeInfo?.title,
                  img:data.items[i].volumeInfo?.imageLinks?.smallThumbnail?data.items[i].volumeInfo?.imageLinks?.smallThumbnail:"",
                  description:data.items[i].volumeInfo?.description?data.items[i].volumeInfo?.description:"",
                  authors: data.items[i].volumeInfo?.authors?.toString(),
                  rating: data.items[i].volumeInfo?.averageRating?data.items[i].volumeInfo?.averageRating:"N/A"
              }
              searchResultsArray.push(dataObject);

              var addedtoWishList="";
              var addstring="Add to Wishlist";

              if(ValidateifAdded(data.items[i].id)==true)
              {
                addedtoWishList=`disabled="disabled"`;
                addstring=`Already added to wishlist`;
              }

            
                htmltable+=` <div class="grid-x padding-1 margin-2 bordered shadow">
                <div class="cell large-2">
                  <img class="searchResultsImage-" src="${data.items[i].volumeInfo?.imageLinks?.smallThumbnail?data.items[i].volumeInfo?.imageLinks?.smallThumbnail:""}"/>
  
                </div>
  
                <div class="cell large-8">
                  <h5>${data.items[i].volumeInfo?.title}</h5>
                  <p>${data.items[i].volumeInfo?.description?data.items[i].volumeInfo?.description:""}</p>
                  <p><span>Authors: </span><span>${data.items[i].volumeInfo?.authors?.toString()}</span></p>
                  <p><span>Rating: </span> <span>${data.items[i].volumeInfo?.averageRating?data.items[i].volumeInfo?.averageRating:"N/A"}</span></p>
                </div>
  
                <div class="cell large-2 likeButton">
                <button class="button button-like btnWishList" ${addedtoWishList} onclick="addToWishlist(${i});" >
                <i class="fa fa-heart"></i>
                <span>${addstring}</span>
                </button>
                </div>
              </div>`
            }  
            
            $("#displayResults").html(htmltable);
  
        });
       
       
    };

    function displayURL()
    {
       var attributevalue = this.getAttribute("data-attribute");
       displayURLbyID(attributevalue);
    }
    
    function displayURLbyID(attributevalue)
    {
        $("#searchresults").attr("style","display:none");
        $("#wishlist").attr("style","display:none");
        $("#detailspage").attr("style","display:none");
        $("#mainSection").attr("style","display:none");
        $("#" + attributevalue).attr("style","display:block");

    }

    function addToWishlist(index){  
        
        if(!ValidateifAdded(searchResultsArray[index].identifier))
        {
            wishListArray.push(searchResultsArray[index]);
            //Should be added to the local storage, 
            localStorage.setItem("wishlist",JSON.stringify(wishListArray));
            googleBooksApi();
            renderWishlist();
            //1. Create a global array variable (Created for you called wishListArray)
            //2. get from local storage and load array in document.ready
            //3. In this function push selectedObject to array
            //4. Set local storage with the array
            // Refer to previous homework for similar scenario
        }

  
       
    }
    function renderWishlist(){
        renderedHtml = "";

        for (var i=0; i<wishListArray.length; i++){

            renderedHtml += ` <div class="grid-x padding-1 margin-2 bordered shadow">
            <div class="cell large-2">
              <img class="searchResultsImage-" src="${wishListArray[i].img}"/>

            </div>

            <div class="cell large-8">
              <h5>${wishListArray[i].title}</h5>
              <p>${wishListArray[i].description}</p>
              <p><span>Authors: </span><span>${wishListArray[i].authors}</span></p>
              <p><span>Rating: </span> <span>${wishListArray[i].rating}</span></p>
            </div>
          </div>`;
        }

        $("#displayWishlist").html(renderedHtml);
    }    
      
    function ValidateifAdded(identifier)
    {
        for(var i=0;i<wishListArray.length;i++)
        {
            if(wishListArray[i].identifier==identifier)
            {
                return true;
            }
        }
        return false;
    }


$("#searcBtn").on("click",googleBooksApi);
$("#home").on("click",displayURL);
$("#wishlistlink").on("click",displayURL);



//$(".btnMoreInfo").on("click",displayURL);

$(function() {
    $('.button-like')
      .bind('click', function(event) {
        $(".button-like").toggleClass("liked");
      })
  });