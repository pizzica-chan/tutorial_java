package jp.co.example.shinsei.mapper;

import jp.co.example.shinsei.entity.RequestEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RequestMapper {
  List<RequestEntity> findMine(@Param("userId") Long userId);

  List<RequestEntity> searchHistory(
      @Param("userId") Long userId,
      @Param("title") String title,
      @Param("requestStatus") String requestStatus,
      @Param("createdFrom") String createdFrom,
      @Param("createdTo") String createdTo
  );

  RequestEntity findById(@Param("id") Long id, @Param("userId") Long userId);

  int insert(RequestEntity request);

  int update(RequestEntity request);
}
