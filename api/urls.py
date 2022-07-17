from django.urls import path
from django.urls.conf import include
from rest_framework.authtoken import views
from .views import *

app_name = 'api'
urlpatterns = [
    path('register_user/', register_user, name='register_user'),
    path('add_activity/', add_activity, name='add_activity'),
    path('login_user/', views.obtain_auth_token),
    path('logout_user/', logout_user, name='logout_user'),
    path('list_users/<int:my_id>', list_users, name='list_user'),
    path('update_user/<int:user_id>', update_user, name='update_user'),
    path('update_password/', update_password, name='update_password'),
    path('update_profile/<int:user_id>', update_profile, name='update_profile'),
    path('follow_user/<int:my_id>/<int:user_id>', follow_user, name='follow_user'),
    path('unfollow_user/<int:my_id>/<int:user_id>', unfollow_user, name='unfollow_user'),
    path('create_profile/', create_profile, name='create_profile'),
    path('get_user_id', get_user_id, name="get_user_id"), 
    path('get_profile/<int:user_id>', get_profile, name='get_profile'),
    path('get_comments/<int:post_id>', get_comments, name='get_comments'),
    path('get_post/<int:post_id>', get_post, name='get_post'),
    path('get_saved_posts/', get_saved_posts, name='get_saved_posts'),
    path('get_activites/<int:my_id>', get_activites, name='get_activites'),
    path('get_users_stories/<int:my_id>', get_users_stories, name='get_users_stories'),
    path('get_my_story/<int:my_id>', get_my_story, name='get_my_story'),
    path('save_post/<int:my_id>/<int:post_id>', save_post, name='save_post'),
    path('unsave_post/<int:my_id>/<int:post_id>', unsave_post, name='unsave_post'),
    path('get_likers/<int:post_id>', get_likers, name='get_likers'),
    path('list_user_posts/<int:my_id>/<int:user_id>', list_user_posts, name='list_user_posts'),
    path('list_messages/<int:my_id>/<int:sender_id>', list_messages, name='list_messages'),
    path('add_message/', add_message, name='add_message'),
    path('discover_posts/', discover_posts, name='discover_posts'),
    path('news_feed/<int:my_id>', news_feed, name='news_feed'),
    path('create_post/', create_post, name='create_post'),
    path('update_post/<int:id>', update_post, name='update_post'),
    path('delete_post/<int:id>', delete_post, name='delete_post'),
    path('delete_activity/', delete_activity, name='delete_activity'),
    path('add_comment/<int:post_id>', add_comment, name='add_comment'),
    path('add_like/<int:post_id>', add_like, name='add_like'),
    path('add_story/', add_story, name='add_story'),
    path('delete_like/', delete_like, name='delete_like'),
    path('delete_comment/<int:id>', delete_comment, name='delete_comment'),
    path('delete_story/<int:id>', delete_story, name='delete_story'),

]