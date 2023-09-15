import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export let userId;

export function renderPostsPageComponent({ appEl, posts }) {

  const postsHTML = posts
    .map((post) => {
      let likesText = '';
      if (post.likes.length > 1) {
        likesText = ` и еще ${post.likes.length - 1}`;
      }
      return `
      <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button">
          <img src=${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}>
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length === 0 ? post.likes.length : post.likes[0].name}${likesText}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
      ${post.createdAt}
      </p>
      </li>
      `;
    })
    .join("");

    const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">${postsHTML}
                </ul>
              </div>`; 
  // DONE: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      userId = userEl.dataset.userId;
      goToPage(USER_POSTS_PAGE, {
        userId : userId,
      });
    });
  }
}
