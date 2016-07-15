var app = angular.module('NewsFeed', ['ngResource', 'ui.bootstrap'])
.config(function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
})
.service('PostResource', ['$resource', function($resource) {
    this.Post = $resource("/post/:subreddit/:verb", {subreddit: '@subreddit'}, {
        'get': {
            method:'GET',
            params: {'verb': 'list'},
        },
        'create': {
            method:'POST',
            params: {'verb': 'create'},
        },
    });
}])
.service('SubredditResource', ['$resource', function($resource) {
    this.Subreddit = $resource("/subreddit/:verb", {}, {
        'get': {
            method:'GET',
            params: {'verb': 'list'},
        },
        'create': {
            method:'POST',
            params: {'verb': 'create'},
        },
    });
}])
.controller('HomepageController',
            ['$scope', '$timeout', 'filterFilter', 'PostResource', 'SubredditResource',
            function($scope, $timeout, filterFilter, PostResource, SubredditResource) {

    var currentSubreddit = 'global';
    self.getPosts = function() {
        return PostResource.Post.get({'subreddit': currentSubreddit}, function(result) {
            $scope.posts = result.posts;
        }).$promise;
    };
  
    var orderBy=true;
    $scope.orderChange = function(){
        if(orderBy)
            return 'title';
        else
            return '-popularity';
    }


    $scope.orderByName = function(){orderBy=true;}
    $scope.orderByPopularity = function(){orderBy=false;}

    

    $scope.refreshPosts = function(id) {
        currentSubreddit = id;
        self.getPosts();
    };

    // Initialize
    self.posts = [];
    getPosts().then(function() {
        $scope.createPost = function(title, content) {
            return PostResource.Post.create(
                {'subreddit': currentSubreddit, 'title': title, 'content': content},
                function(result) {
                // TODO | Highlight box red and alert user on error
                console.log(result);
                getPosts(); // Refresh visible posts
            }).$promise;
        };


    });

    var getSubreddits = function(){
        return SubredditResource.Subreddit.get(function(result) {
            $scope.subreddits = result.subreddits;
        }).$promise;
    };

    // Initialize
    $scope.subreddits = [];
    getSubreddits().then(function() {
        $scope.createSubreddit = function(title, description,popularity) {
            return SubredditResource.Subreddit.create(
                {'title': title, 'description': description,'popularity':popularity},
                function(result) {
                    // TODO | Highlight box red and alert user on error
                    console.log(result);
                    getSubreddits(); // Refresh existing subreddits list
                });
        };
    });

}])
.controller('TranslationController',
            ['$scope',
            function($scope) {

$scope.myField = "SupperReddit is a school project of FRIENDS,a non-profit team";
    
    $scope.chineseText = function(){
        $scope.myField = "超级莱迪特是非盈利团队“六人行”的学校项目";
    }

     $scope.englishText = function(){
        $scope.myField = "SupperReddit is a school project of FRIENDS,a non-profit team";
    }

}]);