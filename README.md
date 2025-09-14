# My Markdown Blog

## API

- `GET /api/posts/tags`

    ```json
    {
        "tags": [ "tag1", "tag2", "tag3" ]
    }
    ```

- `GET /api/posts?tags=<tag>,<tag>`

    ```json
    {
        "tags": [ "tag1", "tag2" ],
        "posts": [
            {
                "post_id": "test-post",
                "title": "Test Post",
                "description": "This is a test post.",
                "tags": [ "tag1", "tag2" ],
                "thumbnail": "https://example.com/thumbnail.jpg",
                "created_at": "2023-10-01T12:00:00Z",
                "updated_at": "2023-10-01T12:00:00Z"
            },
            {
                "post_id": "another-post",
                "title": "Another Post",
                "description": "This is another post.",
                "tags": [ "tag3" ],
                "thumbnail": "https://example.com/thumbnail.jpg",
                "created_at": "2023-10-02T12:00:00Z",
            }
        ]
    }
    ```

- `POST /api/posts`: Create new posts.

    Request:

    ```plaintext
    Content-Type: multipart/form-data; boundary=boundary

    --boundary
    Content-Disposition: form-data; name="post"
    Content-Type: application/plaintext

    # New Post
    
    This is new post.
    --boundary
    Content-Disposition: form-data; name="files"; filename="diagram.png"
    Content-Type: image/png

    (binary...)
    --boundary--
    ```

    Response:

    ```json
    {
        "id": "<UUID>", 
        "created_at": "2023-10-01T12:00:00Z",
        "registered_content": "# Test Post\n\nThis is a test post.",
    }
    ```

- `GET /api/posts/<post_id>`

    ```json
    {
        "title": "Test Post",
        "description": "This is a test post.",
        "tags": [ "tag1", "tag2" ],
        "thumbnail": "https://example.com/thumbnail.jpg",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z",
    }
    ```

- `GET /api/posts/<post_id>?content=true`

    ```json
    {
        "title": "Test Post",
        "description": "This is a test post.",
        "tags": [ "tag1", "tag2" ],
        "thumbnail": "https://example.com/thumbnail.jpg",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z",
        "content": "# Test Post\n\nThis is a test post."
    }
    ```

- `GET /api/posts/<post_id>/plaintext`

    ```plaintext
    ---
    "title": "Test Post",
    "description": "This is a test post.",
    "tags": [ "tag1", "tag2" ],
    "thumbnail": "https://example.com/thumbnail.jpg"
    "created_at": "2023-10-01T12:00:00Z",
    "updated_at": "2023-10-01T12:00:00Z",
    ---

    # Test Post

    This is a test post.
    ```

- `UPDATE /api/posts/<post_id>`

    Request:

    ```markdown
    # New Post
    
    This is new post.
    ```

    Response:

    ```json
    {
        "id": "<UUID>",
        "updated_at": "2023-10-01T12:00:00Z",
        "registered_content": "# New Post\n\nThis is new post."
    },
    ```

- `DELETE /api/posts/<post_id>?type=soft|hard`

    Response:

    ```json
    {
        "id": "<UUID>",
        "deleted_at": "2023-10-01T12:00:00Z",
        "delete_type": "soft",
        "deleted_content": "# Test Post\n\nThis is a test post."
    }
    ```
