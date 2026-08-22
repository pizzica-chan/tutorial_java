package jp.co.example.shinsei.mapper;

import jp.co.example.shinsei.entity.RequestEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RequestMapper {
  List<RequestEntity> findMine(@Param("userId") Long userId);

  RequestEntity findById(@Param("id") Long id, @Param("userId") Long userId);

  int insert(RequestEntity request);

  int update(RequestEntity request);
}
