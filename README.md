# My Markdown Blog

## API

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

- `GET /api/posts/<post_id>?content_md=true`

    ```json
    {
        "title": "Test Post",
        "description": "This is a test post.",
        "tags": [ "tag1", "tag2" ],
        "thumbnail": "https://example.com/thumbnail.jpg",
        "created_at": "2023-10-01T12:00:00Z",
        "updated_at": "2023-10-01T12:00:00Z",
        "content_md": "# Test Post\n\nThis is a test post."
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

- `POST /api/posts`

    Request:

    ```json
    [
        {
            "post_id": "test-post", // generate in CI
            "title": "Test Post",
            "description": "This is a test post.",
            "tags": [ "tag1", "tag2" ],
            "thumbnail": "./thumbnail.jpg",
            "content_md": "# Test Post\n\nThis is a test post."
        },
        {
            "post_id": "another-post", // generate in CI
            "title": "Another Post",
            "description": "This is another post.",
            "tags": [ "tag3" ],
            "thumbnail": "./thumbnail.jpg",
            "content_md": "# Another Post\n\nThis is another post."
        }
    ]
    ```

    Response:

    ```json
    [
        {
            "post_id": "test-post",
            "tags": [ "tag1", "tag2" ], // 
            "created_at": "2023-10-01T12:00:00Z", // 
        },
        {
            "post_id": "another-post",
            "tags": [ "tag3" ],
            "created_at": "2023-10-02T12:00:00Z",
        }
    ]
    ```

- `UPDATE /api/posts`

    Request:

    ```json
    [
        {
            "post_id": "test-post",
            "title": "Test Post",
            "description": "This is a test post.",
            "tags": [ "tag1", "tag2" ],
            "thumbnail": "./thumbnail.jpg",
            "content_md": "# Test Post\n\nThis is a test post."
        },
        {
            "post_id": "another-post",
            "title": "Another Post",
            "description": "This is another post.",
            "tags": [ "tag3" ],
            "thumbnail": "./thumbnail.jpg",
            "content_md": "# Another Post\n\nThis is another post."
        }
    ]
    ```

    Response:

    ```json
    [
        {
            "post_id": "test-post",
            "tags": [ "tag1", "tag2" ],
            "created_at": "2023-10-01T12:00:00Z",
            "updated_at": "2023-10-01T12:00:00Z"
        },
        {
            "post_id": "another-post",
            "tags": [ "tag3" ],
            "created_at": "2023-10-02T12:00:00Z",
            "updated_at": "2023-10-02T12:00:00Z"
        }
    ]
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
