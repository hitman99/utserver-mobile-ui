<?php

require_once 'utorrent-php/WebUIAPI.php';
require_once 'nicessh.php';
// Construct a new API Object
// The URL must include the "gui" part

//var_dump($webApi);

// Pass the parameters as array
//$response = $webApi->callApi(array(
//    "list" => 1
//));
//echo $response;

if(isset($_POST['action'])){
    switch($_POST['action']){
        case 'addTorrent':{
            $webApi = new WebUIAPI("http://localhost:9999/gui/");
            // Set the username and password
            $webApi->setLoginCredentials("admin", "admin");

            // This call complies with the recent CSRF protection scheme
            $webApi->fetchToken();
            $cookie = ':COOKIE:login=blah';
            $url = $_POST['url'].$cookie;
            $response = $webApi->callApi(array(
                'action' => 'add-url',
                's' => urlencode($url)
            ));
            header('Content-Type: application/json');
            echo $response;
            break;
        }
        case 'start_utserver':{
            try {
                $ssh = new NiceSSH();
                $ssh->connect();
                $ssh_cmd_result = $ssh->exec('./start_utserver.sh autokill');
                echo json_encode(array('status' => trim($ssh_cmd_result)));
                $ssh->disconnect();
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
            break;
        }
        case 'stop_utserver':{
            try {
                $ssh = new NiceSSH();
                $ssh->connect();
                $ssh_cmd_result = $ssh->exec('./stop_utserver.sh');
                echo json_encode(array('status' => trim($ssh_cmd_result)));
                $ssh->disconnect();
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
            break;
        }
        case 'get_server_status':{
            try {
                $ssh = new NiceSSH();
                $ssh->connect();
                $ssh_cmd_result = $ssh->exec('./check_server.sh');
                echo json_encode(array('status' => trim($ssh_cmd_result)));
                $ssh->disconnect();
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
            break;
        }
        case 'get_torrent_status' :{
            $webApi = new WebUIAPI("http://localhost:9999/gui/");
            // Set the username and password
            $webApi->setLoginCredentials("admin", "admin");

            // This call complies with the recent CSRF protection scheme
            $webApi->fetchToken();
            $response = $webApi->callApi(array(
                'list' => 1
            ));
            $result = get_downloading_torrents($response);
            //$response = json_decode($response);
            //print_r($response);
            header('Content-Type: application/json');
            echo $result;
            break;
        }
        case 'get_free_space':{
            echo json_encode(['free_space' => number_format(disk_free_space('/nas')/1024/1024/1024, 2)]);
            break;
        }
        default:{
            echo "no_match";
        }
    }
}


function get_downloading_torrents($utserver_response){
    $list = @json_decode($utserver_response, true);
    $result = array('list' => array());
    if($list != NULL){
        $result['delta_ts'] = $list['torrentc'];
        foreach($list['torrents'] as $torrent){
            if($torrent[1] >= 136){
                $item = array(
                    'status' => $torrent[21],
                    'progress' => $torrent[4] / 10,
                    'name' => $torrent[2],
                    'peers' => $torrent[13],
                    'seeds' => $torrent[15],
                    'hash' => $torrent[0],
                    'download_speed' => number_format($torrent[9] / 1024 / 1024, 2),
                    'added' => $torrent[23]
                );
                array_push($result['list'], $item);
            }
            // Prevent seeding
            if($torrent[21] == "Seeding"){
                stop_seeding_torrent($torrent[0]);
            }
        }
    }
    return json_encode($result);
}


function stop_seeding_torrent($hash){
    $webApi = new WebUIAPI("http://localhost:9999/gui/");
    // Set the username and password
    $webApi->setLoginCredentials("admin", "admin");

    // This call complies with the recent CSRF protection scheme
    $webApi->fetchToken();
    $response = $webApi->callApi(array(
        'action' => 'stop',
        'hash' => $hash
    ));
}
?>
