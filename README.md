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

- `GET /api/posts/<post_id>/markdown`

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

- `POST /api/posts`: Create new posts.

    Request:

    ```json
    [
        {
            // Temporary ID generated in the client for tracking.
            // This is enabled in the session.
            "temp_id": "1",
            "content": "# Test Post\n\nThis is a test post."
        },
        {
            "temp_id": "2",
            "content": "# Another Post\n\nThis is another post."
        }
    ]
    ```

    Response:

    ```json
    [
        {
            // Generated in the client.
            "temp_id": "1",
            // Unique ID generated in the server.
            // ID should not be generated in the client even if the ID is unique in the world.
            // Because the method of generating IDs may change in the future.
            "post_id": "<UUID>", 
            "created_at": "2023-10-01T12:00:00Z",
            "modified_content": "# Test Post\n\nThis is a test post.",
        },
        {
            "temp_id": "2",
            "post_id": "<UUID>",
            "created_at": "2023-10-02T12:00:00Z",
            "modified_content": "# Another Post\n\nThis is another post.",
        }
    ]
    ```

- `UPDATE /api/posts`

    Request:

    ```json
    [
        {
            "post_id": "<UUID>",
            "content": "# Test Post\n\nThis is a test post."
        },
        {
            "post_id": "<UUID>",
            "content": "# Another Post\n\nThis is another post."
        }
    ]
    ```

    Response:

    ```json
    [
        {
            "post_id": "test-post",
            "updated_at": "2023-10-01T12:00:00Z",
            "modified_content": "# Test Post\n\nThis is a test post."
        },
        {
            "post_id": "another-post",
            "updated_at": "2023-10-02T12:00:00Z",
            "modified_content": "# Another Post\n\nThis is another post."
        }
    ]
    ```

- `DELETE /api/posts`

    Request:

    ```json
    [
        {
            "post_id": "test-post",
            "delete_type": "soft"
        },
        {
            "post_id": "another-post",
            "delete_type": "hard"
        }
    ]
    ```

    Response:

    ```json
    [
        {
            "post_id": "test-post",
            "deleted_at": "2023-10-01T12:00:00Z",
            "delete_type": "soft"
        },
        {
            "post_id": "another-post",
            "deleted_at": "2023-10-02T12:00:00Z",
            "delete_type": "hard"
        }
    ]
    ```
