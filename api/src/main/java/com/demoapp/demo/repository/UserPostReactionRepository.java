package com.demoapp.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demoapp.demo.model.UserPostReaction;
import java.util.List;
import java.util.Optional;

public interface UserPostReactionRepository extends JpaRepository<UserPostReaction, Long> {
  Optional<UserPostReaction> findByUserIdAndPostId(Long userId, Long postId);
  List<UserPostReaction> findByUserId(Long userId);
}

