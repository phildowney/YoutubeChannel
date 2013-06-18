// Some variables to remember state.
        var plId, nextPageToken, prevPageToken;
        var vidIds = new Array();
        var vCallback;
        var _channel;
        function appendResults(text) {
            var results = document.getElementById('results');
            results.appendChild(document.createElement('P'));
            results.appendChild(document.createTextNode(text));
        }

        function makeRequest() {
            requestUserUploadsPlaylistId();
        }

        function loadYouTube(channel,callback) {
            
            _channel = channel;
            vCallback = callback;
            gapi.client.setApiKey('AIzaSyCjbLmfhBvGAFR7gEQcoTnivVp6qoDWUHg');
            gapi.client.load('youtube', 'v3',function() {
                // After both client interfaces load, use the Data API to request
                // information about the authenticated user's channel.
                requestUserUploadsPlaylistId();
              });
        }
      
  
        //Retrieve the uploads playlist id.
        function requestUserUploadsPlaylistId() {
          // https://developers.google.com/youtube/v3/docs/channels/list
          var request = gapi.client.youtube.channels.list({
            // mine: '' indicates that we want to retrieve the channel for the authenticated user.
            forUsername: _channel,
            part: 'contentDetails',
            key: 'AIzaSyCjbLmfhBvGAFR7gEQcoTnivVp6qoDWUHg'
          });
          request.execute(function(response) {
            plId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(plId);
          });
        }
        
        // Retrieve a playist of videos.
        function requestVideoPlaylist(plId, pageToken) {

            vidIds = new Array(); 
            $('#video-container').html('');
            var requestOptions = {
                playlistId: plId,
                part: 'snippet',
                maxResults: 50,
                key: 'AIzaSyCjbLmfhBvGAFR7gEQcoTnivVp6qoDWUHg'
            };
            
            if (pageToken) {
                requestOptions.pageToken = pageToken;
            }
            
            var request = gapi.client.youtube.playlistItems.list(requestOptions);
            request.execute(function(response) {
            
            //Only show the page buttons if there's a next or previous page.
            nextPageToken = response.result.nextPageToken;
            //var nextVis = nextPageToken ? 'visible' : 'hidden';
            //$('#next-button').css('visibility', nextVis);
            prevPageToken = response.result.prevPageToken
            //var prevVis = prevPageToken ? 'visible' : 'hidden';
            //$('#prev-button').css('visibility', prevVis);
        
            var playlistItems = response.result.items;
            if (playlistItems) {
                // For each result lets show a thumbnail.
                jQuery.each(playlistItems, function(index, item) {
                    vidIds[vidIds.length] = item.snippet.resourceId.videoId;
                });
            }
            
            vCallback(vidIds);
            
            if (nextPageToken) {
              requestVideoPlaylist(plId, nextPageToken);
            }
            
            
          });
        }
        
        // Retrieve the next page of videos.
        function nextPage() {
          requestVideoPlaylist(plId, nextPageToken);
        }
        
        // Retrieve the previous page of videos.
        function previousPage() {
          requestVideoPlaylist(plId, prevPageToken);
        }