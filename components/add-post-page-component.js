import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { addPostApi } from "../api.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";

export function renderAddPostPageComponent({
  appEl,
  token,
  // getToken
}) {
  let imageUrl = "";

  const renderAddPostForm = () => {
    // DONE: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
          <h3 class="form-title">Добавить пост</h3>
            <div class="form-inputs">
              <div class="upload-image-container">
                <div class="upload=image">
                  <label class="file-upload-label secondary-button">
                  <input type="file" class="file-upload-input" style="display:none">
                  Выберите фото
                  </label>
                </div>
              </div>
              <label>
                Опишите фотографию:
                <textarea class="input textarea" id="description-input" rows="4"></textarea>
              </label>

              <div class="form-error"></div>
              
              <button class="button" id="add-button">Добавить</button>
            </div>
      </div>
    </div>    
`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    function onAddPostClick() {
      // из auth-page-component setError и renderHeaderComponent !!! Не вызываем перерендер, чтобы не сбрасывалась заполненная форма
      // Точечно обновляем кусочек дом дерева
      const setError = (message) => {
        appEl.querySelector(".form-error").textContent = message;
      };
      setError("");

      const description = document.getElementById("description-input").value;

      if (!description) {
        alert("Введите описание");
        return;
      }
      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }
      else {
        addPostApi({
          description: description,
          imageUrl,
          token,
        })
        .then(() => {
          goToPage(POSTS_PAGE)
        })
        .catch((error) => {
        console.warn(error);
        setError(error.message);
        });
      }
    }

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick();
    });
  };

  renderAddPostForm();
}
