let postArray;

/**
 * Default posts to populate blog with if no local storage data found
 */
const defaultPosts = [
  {
    title: 'How to Get a Job',
    date: new Date().toISOString(),
    description: 'Work hard and have fun!',
  },
  {
    title: 'Front End Is Fun',
    date: new Date().toISOString(),
    description: 'Beep Boop',
  },
];

/**
 * Empty post template fields
 */
const emptyPost = {
  title: '',
  date: '',
  description: '',
};

/**
 * Easy getters for all used DOM elements
 */
const Elements = {
  addPostBtn: document.getElementById('add-post'),
  dialog: document.getElementById('dialog'),
  postContainer: document.getElementById('posts'),
  addPostDialog: {
    header: document.getElementById('add-post-header'),
    titleInput: document.getElementById('title'),
    dateInput: document.getElementById('date'),
    descriptionInput: document.getElementById('description'),
    cancelBtn: document.getElementById('cancel'),
    closeBtn: document.getElementById('close'),
  },
  confirmDeleteDialog: {
    header: document.getElementById('confirm-message'),
    cancelBtn: document.getElementById('confirm-close'),
    confirmBtn: document.getElementById('confirm-ok'),
  },
};

/**
 * Object to manage postArray data
 */
const Posts = {
  get: key => postArray[Posts.getIndex(key)],
  getIndex: key => postArray.findIndex(post => post.key === key),
  getAll: () => postArray,
  valueWithKey: post => ({ ...post, key: `${post.title}-${postArray.length + 1}` }),
  updatePost: post => {
    const index = Posts.getIndex(post.key);
    postArray[index] = post;
  },
  add: post => {
    Posts.getAll().push(Posts.valueWithKey(post));
  },
  delete: key => {
    const index = Posts.getIndex(key);
    postArray.splice(index, 1);
  },
};

/**
 * Object to manage interactions with localStorage
 */
const LocalStorage = {
  addPost: post => {
    const posts = JSON.parse(window.localStorage.getItem('posts')) ?? [];
    posts.push(post);
    window.localStorage.setItem('posts', JSON.stringify(posts));
  },
  setPostsArray: posts => window.localStorage.setItem('posts', JSON.stringify(posts)),
  getAllPosts: () => JSON.parse(window.localStorage.getItem('posts')) ?? [],
};

/**
 * Object to manage interactions with the dialog component
 */
const Dialog = {
  setPromptFields: fields => {
    Object.keys(fields).forEach(key => {
      try {
        document.getElementById(key).value = fields[key];
      } catch (err) {}
    });
  },
  setType: type => {
    const box = Elements.dialog;
    box.dataset.type = type;
  },
  open: type => {
    Dialog.setType(type);
    Elements.dialog.show();
  },
  close: () => {
    Elements.dialog.classList.add('close');
    setTimeout(() => {
      Elements.dialog.close();
      Elements.dialog.classList.remove('close');
    }, 200);
  },
  awaitPromptInput: async () => {
    const close = Elements.addPostDialog.closeBtn;
    const cancel = Elements.addPostDialog.cancelBtn;
    const title = Elements.addPostDialog.titleInput;
    const date = Elements.addPostDialog.dateInput;
    const description = Elements.addPostDialog.descriptionInput;

    return new Promise(resolve => {
      close.addEventListener(
        'click',
        () =>
          resolve({
            title: title.value,
            date: date.value,
            description: description.value,
          }),
        { once: true }
      );
      cancel.addEventListener('click', () => resolve(null), { once: true });
    });
  },
  awaitConfirmInput: async () => {
    const cancel = Elements.confirmDeleteDialog.cancelBtn;
    const ok = Elements.confirmDeleteDialog.confirmBtn;

    return new Promise(resolve => {
      cancel.addEventListener('click', () => resolve(false), { once: true });
      ok.addEventListener('click', () => resolve(true), { once: true });
    });
  },
  getNewPost: async () => {
    Dialog.setPromptFields(emptyPost);
    Elements.addPostDialog.closeBtn.querySelector('#close-text').innerText = 'Add Post';
    Elements.addPostDialog.header.innerText = 'Add New Post';
    Dialog.open('prompt');
    const post = await Dialog.awaitPromptInput();
    return post;
  },
  getModifiedPost: async post => {
    Dialog.setPromptFields(post);
    Elements.addPostDialog.closeBtn.querySelector('#close-text').innerText = 'Save';
    Elements.addPostDialog.header.innerText = 'Edit Post';
    Dialog.open('prompt');
    const newPost = await Dialog.awaitPromptInput();
    return newPost;
  },
  getConfirmValue: async () => {
    Dialog.open('confirm');
    const confirmValue = await Dialog.awaitConfirmInput();
    return confirmValue;
  },
};

/**
 * Object to handle rendering our page UI
 */
const RenderHandler = {
  addPost: post => {
    const { title, date, description, key } = post;
    const newPost = document.createElement('li');
    newPost.className = 'post-item';
    newPost.dataset.key = key;
    newPost.innerHTML = `
  <div>
    <h2>${title ? title : `Blog Post`}</h2>
    <h4>${date ? new Date(date).toDateString() : 'No date given.'}</h4>
    </div>
    <p>${description ? description : 'No description given.'}</p>
  </div>
  `;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'buttons';

    const editButton = document.createElement('button');
    editButton.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.66667 22.3333H4.53333L16.0333 10.8333L14.1667 8.96667L2.66667 20.4667V22.3333ZM21.7333 8.90001L16.0667 3.30001L17.9333 1.43334C18.4444 0.922227 19.0724 0.666672 19.8173 0.666672C20.5622 0.666672 21.1898 0.922227 21.7 1.43334L23.5667 3.30001C24.0778 3.81112 24.3444 4.42801 24.3667 5.15067C24.3889 5.87334 24.1444 6.48978 23.6333 7.00001L21.7333 8.90001ZM19.8 10.8667L5.66667 25H0V19.3333L14.1333 5.20001L19.8 10.8667ZM15.1 9.90001L14.1667 8.96667L16.0333 10.8333L15.1 9.90001Z" fill="black"/>
</svg>

<span>Edit</span>
`;
    editButton.type = 'button';
    editButton.addEventListener('click', EventListeners.editPost(key));
    buttonContainer.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.33332 24C3.59998 24 2.97198 23.7387 2.44932 23.216C1.92665 22.6933 1.66576 22.0658 1.66665 21.3333V4C1.28887 4 0.971985 3.872 0.715985 3.616C0.459985 3.36 0.332429 3.04356 0.333318 2.66667C0.333318 2.28889 0.461318 1.972 0.717318 1.716C0.973318 1.46 1.28976 1.33245 1.66665 1.33334H6.99998C6.99998 0.95556 7.12798 0.638671 7.38398 0.382671C7.63998 0.126671 7.95643 -0.000884275 8.33332 4.61361e-06H13.6667C14.0444 4.61361e-06 14.3613 0.128005 14.6173 0.384005C14.8733 0.640005 15.0009 0.956449 15 1.33334H20.3333C20.7111 1.33334 21.028 1.46134 21.284 1.71734C21.54 1.97334 21.6675 2.28978 21.6667 2.66667C21.6667 3.04445 21.5387 3.36134 21.2827 3.61734C21.0267 3.87334 20.7102 4.00089 20.3333 4V21.3333C20.3333 22.0667 20.072 22.6947 19.5493 23.2173C19.0267 23.74 18.3991 24.0009 17.6667 24H4.33332ZM4.33332 4V21.3333H17.6667V4H4.33332ZM6.99998 17.3333C6.99998 17.7111 7.12798 18.028 7.38398 18.284C7.63998 18.54 7.95643 18.6676 8.33332 18.6667C8.7111 18.6667 9.02798 18.5387 9.28398 18.2827C9.53998 18.0267 9.66754 17.7102 9.66665 17.3333V8C9.66665 7.62223 9.53865 7.30534 9.28265 7.04934C9.02665 6.79334 8.71021 6.66578 8.33332 6.66667C7.95554 6.66667 7.63865 6.79467 7.38265 7.05067C7.12665 7.30667 6.9991 7.62312 6.99998 8V17.3333ZM12.3333 17.3333C12.3333 17.7111 12.4613 18.028 12.7173 18.284C12.9733 18.54 13.2898 18.6676 13.6667 18.6667C14.0444 18.6667 14.3613 18.5387 14.6173 18.2827C14.8733 18.0267 15.0009 17.7102 15 17.3333V8C15 7.62223 14.872 7.30534 14.616 7.04934C14.36 6.79334 14.0435 6.66578 13.6667 6.66667C13.2889 6.66667 12.972 6.79467 12.716 7.05067C12.46 7.30667 12.3324 7.62312 12.3333 8V17.3333Z" fill="black"/>
</svg>
<span>Delete</span>
`;
    deleteButton.type = 'button';
    deleteButton.addEventListener('click', EventListeners.deletePost(key));

    buttonContainer.appendChild(deleteButton);

    newPost.appendChild(buttonContainer);
    Elements.postContainer.appendChild(newPost);
  },
  renderPosts: posts => {
    RenderHandler.clearPosts();
    posts.forEach(RenderHandler.addPost);
  },
  clearPosts: () => (Elements.postContainer.innerHTML = ''),
  sync: () => {
    RenderHandler.renderPosts(Posts.getAll());
    LocalStorage.setPostsArray(Posts.getAll());
  },
};

/**
 * Various button event listeners
 */
const EventListeners = {
  closeDialog: () => Dialog.close(),
  createPost: async () => {
    const createdPostData = await Dialog.getNewPost();
    if (!createdPostData) return;
    const newPost = Posts.valueWithKey(createdPostData);
    Posts.add(newPost);
    RenderHandler.addPost(newPost);
    LocalStorage.addPost(newPost);
  },
  editPost: key => async () => {
    const existingPost = Posts.get(key);
    const newPost = await Dialog.getModifiedPost(existingPost);
    if (!newPost) return;
    Posts.updatePost({ ...newPost, key });
    RenderHandler.sync();
  },
  deletePost: key => async () => {
    const deleteVerified = await Dialog.getConfirmValue();
    if (deleteVerified) Posts.delete(key);
    RenderHandler.sync();
  },
};

/**
 * Set up page functionality
 */
const initialize = () => {
  let posts = LocalStorage.getAllPosts();
  if (posts.length === 0) {
    LocalStorage.setPostsArray(defaultPosts);
    posts = defaultPosts;
  }
  postArray = posts.map((post, index) => ({ ...post, key: `${post.title}-${index}` }));
  postArray.forEach(RenderHandler.addPost);

  Elements.addPostBtn.addEventListener('click', EventListeners.createPost);
  Elements.addPostDialog.closeBtn.addEventListener('click', EventListeners.closeDialog);
  Elements.addPostDialog.cancelBtn.addEventListener('click', EventListeners.closeDialog);
  Elements.confirmDeleteDialog.cancelBtn.addEventListener('click', EventListeners.closeDialog);
  Elements.confirmDeleteDialog.confirmBtn.addEventListener('click', EventListeners.closeDialog);
};

initialize();
