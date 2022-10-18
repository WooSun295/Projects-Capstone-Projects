"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
   console.debug("navAllStories", evt);
   hidePageComponents();
   putStoriesOnPage();
   localStorageFav();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
   console.debug("navLoginClick", evt);
   hidePageComponents();
   $loginForm.show();
   $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function profile() {
   hidePageComponents();
   $profileForm.show();
}

$("#nav-user-profile").on("click", profile);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
   console.debug("updateNavOnLogin");
   $(".navbar-main").show();
   $navLogin.hide();
   $navLogOut.show();
   $navUserProfile.text(`${currentUser.username}`).show();
   $loginForm.hide();
   $signupForm.hide();
}

function submitNewStory(evt) {
   navAllStories();
   $newStoryForm.show();
}

$navSubmit.on("click", submitNewStory);

function onlyFavoriteStories() {
   const favoriteStories = currentUser.favorites;
   hidePageComponents();

   if (favoriteStories.length === 0) $blankContainer.show().html("No Favorites Added!");
   else {
      $favorites.empty();

      for (let story of favoriteStories) {
         const $favStory = generateStoryMarkup(new Story(story));
         $favStory.children()[0].checked = true;
         // $favStory.children[0].checked = true;
         $favorites.append($favStory);
      }

      $favorites.show();
   }
}

$navFavorites.on("click", onlyFavoriteStories);

function onlyUserStories() {
   const userStories = currentUser.ownStories;
   hidePageComponents();

   if (userStories.length === 0) $blankContainer.show().html("No Stories Added by User!");
   else {
      $myStories.empty();

      for (let story of userStories) {
         const $userStory = generateUserStoryMarkup(story);
         $myStories.append($userStory);
      }
      $myStories.show();
   }
   $myStories.on("click", ".delete-story", deleteUserStory);

   $(".delete-story").hover(
      function () {
         $(this).parent().css("color", "red").css("text-decoration", "line-through");
      },
      function () {
         $(this).parent().css("color", "").css("text-decoration", "none");
      }
   );
}

$navStories.on("click", onlyUserStories);

async function deleteUserStory(e) {
   const id = e.target.parentElement.id;
   const token = currentUser.loginToken;
   const ownStories = currentUser.ownStories;

   const response = await axios({
      url: `${BASE_URL}/stories/${id}`,
      method: "DELETE",
      data: { token },
   });

   for (let i = 0; i < ownStories.length; i++) {
      if (ownStories[i].storyId === response.data.story.storyId) {
         currentUser.ownStories.splice(i, 1);
         currentUser.favorites.splice(i, 1);
      }
   }

   $(this).parent().remove();

   updateUserFavorites();
   onlyUserStories();
}
