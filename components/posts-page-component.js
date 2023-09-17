import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { switchLikeApi, deletePostApi } from "../api.js";

export let userId; // для страницы постов выбранного юзера
export let postId; // для лайков

export function renderPostsPageComponent({ appEl, posts, token, user }) {
  const postsHTML = posts
    .map((post) => {
      let likesText = "";
      if (post.likes.length > 1) {
        likesText = ` и еще ${post.likes.length - 1}`;
      }
      return `
      <li data-item-id="${post.id}" class="post">
        <div class="post-header">

          <div class="post-header-user" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>

          <button data-post-id="${post.id}" class="delete-button" ${
            user !== null && user._id === post.user.id
              ? `style="display: block"`
              : `style="display: none"`
          }>
            <img class="img-trash" src="./assets/images/trash3.svg">
          </button>

        </div>

        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>

        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img class="img-likes" src=${
              post.isLiked
                ? "./assets/images/like-active.svg"
                : "./assets/images/like-not-active.svg"
            }>
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${
              post.likes.length === 0 ? post.likes.length : post.likes[0].name
            }${likesText}</strong>
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

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header-user")) {
    userEl.addEventListener("click", () => {
      userId = userEl.dataset.userId;
      goToPage(USER_POSTS_PAGE, {
        userId: userId,
      });
    });
  }

  for (let likeButtonEl of document.querySelectorAll(".like-button")) {
    let likedMode = false; // false по умолчанию, лайкнут пост авторизованным пользователем
    let loginUserId = user ? user._id : null; // id авторизованного в приложении юзера

    if (loginUserId !== null) {
      likeButtonEl.addEventListener("click", () => {
        postId = likeButtonEl.dataset.postId;

        const foundPost = posts.find((post) => post.id === postId);

        if (foundPost) {
          likedMode = foundPost.likes.some((like) => like.id === loginUserId);
        }

        switchLikeApi({ token, postId, likedMode })
          .then((postFromApi) => {
            const postIndex = posts.findIndex(
              (post) => post.id === postFromApi.id
            );
            if (postIndex !== -1) {
              posts[postIndex] = postFromApi;

              let likesText = "";
              if (postFromApi.likes.length > 1) {
                likesText = ` и еще ${postFromApi.likes.length - 1}`;
              }
              const updatePostEl = document.querySelector(
                `[data-item-id="${postFromApi.id}"]`
              );

              updatePostEl.querySelector(".like-button").innerHTML = `
            <img class="img-likes" src=${
              postFromApi.isLiked
                ? "./assets/images/like-active.svg"
                : "./assets/images/like-not-active.svg"
            }>`;
              updatePostEl.querySelector(".post-likes-text").innerHTML = `
            Нравится: <strong>${
              postFromApi.likes.length === 0
                ? postFromApi.likes.length
                : postFromApi.likes[0].name
            }${likesText}</strong>
            `;
            }
          })
          .catch((error) => {
            console.warn(error);
          });
      });
    } else {
      likeButtonEl.addEventListener("click", () => {
        alert("Пройдите авторизацию");
        return;
      });
    }
  }

  for (const deleteButtonEl of document.querySelectorAll(".delete-button")) {
    deleteButtonEl.addEventListener("click", () => {
      postId = deleteButtonEl.dataset.postId;
      const confirmation = confirm("Хотите удалить пост?");
      if (confirmation) {
        deletePostApi({ token, postId })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.warn(error);
          });
      }
    });
  }
}
