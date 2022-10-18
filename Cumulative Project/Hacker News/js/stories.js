"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
   storyList = await StoryList.getStories();
   $storiesLoadingMsg.remove();

   putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
   // console.debug("generateStoryMarkup", story);

   const hostName = story.getHostName();
   return $(`
      <li id="${story.storyId}">
        <input class="star" type="checkbox">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateUserStoryMarkup(story) {
   // console.debug("generateStoryMarkup", story);

   const hostName = story.getHostName();
   return $(`
      <li id="${story.storyId}">
        <input class="star" type="checkbox">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="delete-story">[DELETE]</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
   console.debug("putStoriesOnPage");

   $allStoriesList.empty();

   // loop through all of our stories and generate HTML for them
   for (let story of storyList.stories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
   }

   $allStoriesList.show();
}

function localStorageFav() {
   if (localStorage.favorite) {
      const $storiesLis = $allStoriesList.children();
      const localFav = JSON.parse(localStorage.getItem("favorite"));

      currentUser.favorites.splice(0);
      for (let i = 0; i < localFav.length; i++) {
         currentUser.favorites.push(localFav[i]);
      }

      for (let i = 0; i < $storiesLis.length; i++) {
         for (let j = 0; j < localFav.length; j++) {
            if ($storiesLis[i].id === localFav[j].storyId) {
               $storiesLis[i].children[0].checked = true;
            }
         }
      }
   }
}

async function submitNewStory(e) {
   const author = $("#newStory-author").val();
   const title = $("#newStory-title").val();
   const url = $("#newStory-url").val();
   const token = currentUser.loginToken;

   const submission = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: { token, story: { author, title, url } },
   });

   currentUser.ownStories.push(new Story(submission.data.story));

   getAndShowStoriesOnStart();

   $newStoryForm.hide(500);
}

$newStorySubmit.on("click", submitNewStory);

async function checkboxesForFavorite(e) {
   const id = e.target.parentElement.id;
   const username = currentUser.username;
   const token = currentUser.loginToken;
   let response;

   if (e.target.checked) {
      response = await axios({
         url: `${BASE_URL}/users/${username}/favorites/${id}`,
         method: "POST",
         data: { token },
      });
   } else if (!e.target.checked) {
      response = await axios({
         url: `${BASE_URL}/users/${username}/favorites/${id}`,
         method: "DELETE",
         data: { token },
      });
   }

   let { user } = response.data;

   currentUser = new User(
      {
         username: user.username,
         name: user.name,
         createdAt: user.createdAt,
         favorites: user.favorites,
         ownStories: user.stories,
      },
      token
   );

   updateUserFavorites();
   saveUserCredentialsInLocalStorage();
}

$stars.on("click", "input[type*='checkbox']", checkboxesForFavorite);
