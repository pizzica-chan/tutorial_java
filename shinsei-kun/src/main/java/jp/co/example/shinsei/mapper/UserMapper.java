package jp.co.example.shinsei.mapper;

import jp.co.example.shinsei.entity.UserEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
  UserEntity findByUsername(@Param("username") String username);

  UserEntity findById(@Param("id") Long id);

  List<UserEntity> findAll();
}
