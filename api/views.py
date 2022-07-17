from enum import unique
import profile
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import *
from .models import *
import random

# Create your views here.
@api_view(['POST'])
def register_user(request):
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    
    user = User.objects.create_user(username, email, password)

    if user:
        login(request, user)
        profile = Profile.objects.create(user=user)
        profile.save()
        return Response('Register is done')
    else:
        return Response('Register error')


@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        token = Token.objects.create(user=user)
        print(token.key)
        # profile = Profile.objects.create(user=user)
        return Response('Auth success')
    else:
        return Response('Login error')


@api_view(['GET'])
def logout_user(request):
    logout(request)
    return Response('Logout')


@api_view(['GET'])
def list_users(request, my_id):
    profiles = Profile.objects.exclude(user=User.objects.get(id=my_id))
    profiles_serializer = ProfileSerializer(profiles, many=True)
    
    users = User.objects.exclude(id=my_id)
    users_serializer = UserSerializer(users, many=True) 
    
    users = []
    profiles = []
    final_data = []
    for user in users_serializer.data:
        users.append([{'id':user['id'], 'username':user['username']}])

    for profile in profiles_serializer.data:
        profiles.append({'image':profile['image']})
    
    for index in range(0, len(profiles)):
        final_data.append({'id':users[index][0]['id'], 'username':users[index][0]['username'] , 'image':profiles[index]['image']})
    
    return Response(final_data)


@api_view(['GET'])
def list_messages(request, my_id ,sender_id):
    messages = Message.objects.filter(sender=sender_id, receiver=my_id) | Message.objects.filter(sender=my_id, receiver=sender_id)
    messages = messages.order_by('date_added')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_message(request):
    serializer = MessageSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)


@api_view(['POST'])
def update_user(request, user_id):
    user = User.objects.get(id=user_id)
    data = request.data
    data['password'] = user.password
    serializer = UserSerializer(instance=user, data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors)
        
    return Response(serializer.data)


@api_view(['POST','GET'])
def update_profile(request, user_id):
    try:
        profile = Profile.objects.get(user=user_id)
        serializer = ProfileSerializer(instance=profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
    except:
        serializer = ProfileSerializer(data=request.data)
    
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
    


@api_view(['POST'])
def follow_user(request, my_id, user_id):
    following_user = Profile.objects.get(user=User.objects.get(id=my_id))
    followed_user = Profile.objects.get(user=User.objects.get(id=user_id))

    following = following_user.following
    following.add(user_id)

    followers = followed_user.followers
    followers.add(request.user.id)

    followed_user.save()
    followed_user.save()

    return Response('Successfully completed!')


@api_view(['POST'])
def unfollow_user(request, my_id, user_id):
    following_user = Profile.objects.get(user=User.objects.get(id=my_id))
    followed_user = Profile.objects.get(user=User.objects.get(id=user_id))

    following = following_user.following
    following.remove(User.objects.get(id=user_id))

    followers = followed_user.followers
    followers.remove(request.user)

    followed_user.save()
    followed_user.save()

    return Response('Successfully completed!')


@api_view(['POST'])
def create_profile(request):
    serializer = ProfileSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors)
    
    return Response(serializer.data)


@api_view(['POST'])
def update_password(request):
    user = request.user
    user.set_password(request.data['password'])
    user.save()
    return Response('Password changed')    


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_id(request):
    user = request.user
    print(user)
    return Response({'my_id': user.id})


@api_view(['GET'])
def get_profile(request, user_id):
    profile = Profile.objects.get(user=user_id)
    profile_serializer = ProfileSerializer(profile)
    
    user = User.objects.get(id=user_id)
    user_serializer = UserSerializer(user)
    
    final_data = {}
    for key in profile_serializer.data.keys():
        final_data[key] = profile_serializer.data[key]
        
    for key in user_serializer.data.keys():
        final_data[key] = user_serializer.data[key]
    
    return Response(final_data)


@api_view(['GET'])
def get_comments(request, post_id):
    post = Post.objects.get(id=post_id)
    post_comments = post.comments
    serializer = CommentSerializer(post_comments, many=True)
    comments = []
    final_data = []
    for comment in serializer.data:
        comments.append(comment)   
        profile = Profile.objects.get(user=comment['commenter'])
        profile_serializer = ProfileSerializer(profile)
        
        user = User.objects.get(id=comment['commenter'])
        user_serializer = UserSerializer(user)
        
        data = {}
        data['username'] = user_serializer.data['username']
        data['user_id'] = user_serializer.data['id']
        data['image'] = profile_serializer.data['image'] 
        data['comment'] = comment
        
        final_data.append(data)

    return Response(final_data)


@api_view(['GET'])
def get_post(request, post_id):
    post = Post.objects.get(id=post_id)
    profile = Profile.objects.get(user=post.owner)
    serializer = PostSerializer(post)
    photoes_urls = []
    for photo_id in serializer.data['photoes']:
        photoes_urls.append(str(Photo.objects.get(id=photo_id)))

    final_data = dict(serializer.data)
    final_data['photoes'] = photoes_urls
    final_data['image'] = str(profile.image)
    final_data['username'] = profile.user.username
    final_data['profile_id'] = profile.id
    return Response(final_data)


@api_view(['POST'])
def save_post(request, my_id, post_id):
    post = Post.objects.get(id=post_id)
    post.saved = True
    post.saving_user_id = my_id
    post.save()
    return Response('Post saved!')


@api_view(['POST'])
def unsave_post(request, my_id, post_id):
    post = Post.objects.get(id=post_id)
    post.saved = False
    post.saving_user_id = my_id
    post.save()
    return Response('Post unsaved!')


@api_view(['GET'])
def get_saved_posts(request, my_id):
    posts = Post.objects.filter(saved=True, saving_user_id=my_id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def list_user_posts(request, user_id):
    user = User.objects.get(id=user_id)
    posts = Post.objects.filter(owner=user)
    serializer = PostSerializer(posts, many=True)

    final_data = []
    for post in serializer.data:
        final_data.append(dict(post))

    
    for chunk in final_data:
        chunk['photoes'] = str(Photo.objects.get(id=chunk['photoes'][0]))
    
    return Response(final_data)


@api_view(['GET'])
def discover_posts(request):
    posts = Post.objects.all()
    random_posts = []
    if len(posts) < 10:
        for i in range(len(posts)):
            random_posts.append(posts[i])
    else:
        for i in range(10):
            random_posts.append(posts[i])

    serializer = PostSerializer(random_posts, many=True)

    final_data = []
    for post in serializer.data:
        final_data.append(dict(post))

    for chunk in final_data:
        chunk['photoes'] = str(Photo.objects.get(id=chunk['photoes'][0]))

    return Response(final_data)


@api_view(['GET'])
def news_feed(request, my_id):
    profile = Profile.objects.get(user=my_id)
    following = profile.following
    following_ids = []
    for following in following.values():
        following_ids.append(following['id'])

    final_posts = []
    posts = Post.objects.all()
    for post in posts:
        if post.owner.id in following_ids:
            final_posts.append(post)
    serializer = PostSerializer(final_posts, many=True)

    final_data = []
    for post in serializer.data:
        data = {}
        for key in post.keys():
            data[key] = post[key]
            user = User.objects.get(id=post['owner'])
            profile = Profile.objects.get(user=user)
            data['username'] = user.username
            data['image'] = str(profile.image)
            data['profile_id'] = profile.id
            photoes_urls = []
            for photo_id in post['photoes']:
                photoes_urls.append(str(Photo.objects.get(id=photo_id)))
            data['photoes'] = photoes_urls
            if len(post['likes'])> 0:
                data['liker'] =  Like.objects.get(id=post["likes"][0]).liker.username
        final_data.append(data)
    return Response(final_data)


@api_view(['POST'])
def create_post(request):
    files = request.FILES.getlist('images')
    data = request.POST
    post = Post.objects.create(caption=data['caption'], owner=User.objects.get(id=data['owner']))
    for file in files:
        photo_serializer = PhotoSerializer(data={'photo':file})
        if photo_serializer.is_valid():
            photo_serializer.save()
            post.save()
            post.photoes.add(photo_serializer.data['id'])
            post.save()
        else:
            return Response(photo_serializer.errors)

    return Response('Post upload successfuly')
        
        
@api_view(['GET', 'POST'])
def update_post(request, id):
    post = Post.objects.get(id=id)
    
    if request.method == 'GET':
        serializer = PostSerializer(instance=post)
    else:
        serializer = PostSerializer(instance=post, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors)
            
    return Response(serializer.data)


@api_view(['POST'])
def delete_post(request, id):
    post = Post.objects.get(id=id)
    post.delete()
            
    return Response('Post deleted!')


@api_view(['POST'])
def add_comment(request, post_id):
    serializer = CommentSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        post = Post.objects.get(id=post_id)
        post.comments.add(serializer.data['id'])
        post.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)
    

@api_view(['GET'])
def get_likers(request, post_id):
    post = Post.objects.get(id=post_id)
    likes = post.likes
    serializer = LikeSerializer(likes, many=True)
    likers = []
    if len(serializer.data)>0:
        for like in serializer.data:
            likers.append(User.objects.get(id=like['liker']).username)
    return Response(likers)

    
@api_view(['POST'])
def add_like(request, post_id):
    serializer = LikeSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        post = Post.objects.get(id=post_id)
        post.save()
        post.likes.add(serializer.data['id'])
        post.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)
    
    
@api_view(['DELETE'])
def delete_like(request):
    like = Like.objects.last()
    like.delete()
    return Response('Like deleted!')
  

@api_view(['DELETE'])
def delete_comment(request, id):
    comment = Comment.objects.get(id=id)
    comment.delete()
    return Response('Comment deleted!')


@api_view(['GET'])
def get_activites(request, my_id):
    activites = Activity.objects.filter(influnced=my_id).order_by('date_added')
    serializer = ActivitySerializer(activites, many=True)
    final_data = []
    for activity in serializer.data:
        data = dict(activity)
        data['profile_image'] = str(Profile.objects.get(user=activity['influncer']).image)
        data['username'] = User.objects.get(id=activity['influncer']).username
        final_data.append(data)

    return Response(final_data)


@api_view(['POST'])
def add_activity(request):
    serializer = ActivitySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)


@api_view(['DELETE'])
def delete_activity(request):
    activity = Activity.objects.last()
    activity.delete()
    return Response('Activity deleted!')


@api_view(['POST'])
def add_story(request):
    files = request.FILES.getlist('images')
    data = request.POST
    story = Story.objects.create(owner=User.objects.get(id=data['owner']))
    for file in files:
        photo_serializer = PhotoSerializer(data={'photo':file})
        if photo_serializer.is_valid():
            photo_serializer.save()
            story.save()
            story.photoes.add(photo_serializer.data['id'])
            story.save()
        else:
            return Response(photo_serializer.errors)

    return Response('Story upload successfuly')


@api_view(['GET'])
def get_users_stories(request, my_id):
    stories = Story.objects.exclude(owner=my_id)
    story_serializer = StorySerializer(stories, many=True)
    owners = []
    for story in story_serializer.data:
        owners.append(story['owner'])

    profiles = Profile.objects.exclude(user=User.objects.get(id=my_id))
    profiles_serializer = ProfileSerializer(profiles, many=True)
    
    users = User.objects.exclude(id=my_id)
    users_serializer = UserSerializer(users, many=True) 
    
    users = []
    profiles = []
    stories = []
    final_data = []
    for user in users_serializer.data:
        if user['id'] in owners:
            users.append([{'id':user['id'], 'username':user['username']}])

    for profile in profiles_serializer.data:
        if profile['user'] in owners:
            profiles.append({'image':profile['image']})

    for story in story_serializer.data:
        story_photoes = []
        for story_photo_id in story['photoes']:
            story_photoes.append(str(Photo.objects.get(id=story_photo_id)))
        stories.append(story_photoes)
    
    for index in range(0, len(profiles)):
        final_data.append({'id':users[index][0]['id'], 'username':users[index][0]['username'] , 'image':profiles[index]['image'], 'story_photoes':stories[index]})
    
    return Response(final_data)



@api_view(['GET'])
def get_my_story(request, my_id):
    try:
        story = Story.objects.get(owner=my_id)
        story_serializer = StorySerializer(story, many=False)
        print(story_serializer.data)
        story_photoes = []
        for story_photo_id in story_serializer.data['photoes']:
            story_photoes.append(str(Photo.objects.get(id=story_photo_id)))
        return Response(story_photoes)
    except:
        return Response([])


@api_view(['DELETE'])
def delete_story(request, id):
    story = Story.objects.get(owner=id)
    story.delete()
    return Response('Story deleted!')