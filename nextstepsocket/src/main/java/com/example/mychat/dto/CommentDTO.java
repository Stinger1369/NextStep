package com.example.mychat.dto;

public class CommentDTO {
    private String content;
    private String authorId;
    private String postId;

    public CommentDTO() {
    }

    public CommentDTO(String content, String authorId, String postId) {
        this.content = content;
        this.authorId = authorId;
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }
}
