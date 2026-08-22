package jp.co.example.shinsei.service;

import jp.co.example.shinsei.entity.UserEntity;
import jp.co.example.shinsei.mapper.UserMapper;
import jp.co.example.shinsei.security.LoginUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginUserDetailsService implements UserDetailsService {
  private final UserMapper userMapper;

  @Override
  public UserDetails loadUserByUsername(String username) {
    UserEntity user = userMapper.findByUsername(username);
    if (user == null) {
      throw new UsernameNotFoundException(username);
    }
    return new LoginUser(
        user.getId(),
        user.getUsername(),
        user.getPassword(),
        user.getDisplayName(),
        user.getEmail(),
        user.getRole()
    );
  }
}
