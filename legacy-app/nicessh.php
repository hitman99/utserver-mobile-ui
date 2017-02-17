<?php 
class NiceSSH { 
    // SSH Host 
    private $ssh_host = 'localhost'; 
    // SSH Port 
    private $ssh_port = 22; 
    // SSH Server Fingerprint 
    private $ssh_server_fp = 'C5C61DCE8E9E338291174AF374C60D3F'; 
    // SSH Username 
    private $ssh_auth_user = 'hitman'; 
    // SSH Public Key File 
    private $ssh_auth_pub = 'id_rsa.pub';
    // SSH Private Key File 
    private $ssh_auth_priv = 'id_rsa.pem';
    // SSH Private Key Passphrase (null == no passphrase) 
    private $ssh_auth_pass = null; 
    // SSH Connection 
    private $connection; 
    
    public function connect() { 
        if (!($this->connection = ssh2_connect($this->ssh_host, $this->ssh_port))) { 
            throw new Exception('Cannot connect to server'); 
        } 
        $fingerprint = ssh2_fingerprint($this->connection, SSH2_FINGERPRINT_MD5 | SSH2_FINGERPRINT_HEX); 
        if (strcmp($this->ssh_server_fp, $fingerprint) !== 0) { 
            throw new Exception('Unable to verify server identity!'); 
        } 
        if (!ssh2_auth_pubkey_file($this->connection, 
                                   $this->ssh_auth_user, 
                                   $this->ssh_auth_pub, 
                                   $this->ssh_auth_priv)) { 
            throw new Exception('Autentication rejected by server'); 
        } 
    } 
    public function exec($cmd, $nowait = false) { 
        if (!($stream = ssh2_exec($this->connection, $cmd))) { 
            return 'SSH comman failed'; 
        } 
        if ($nowait){
            return "";
        }
        stream_set_blocking($stream, true);
        $data = "";
        while ($buf = fread($stream, 4096)) { 
            $data .= $buf; 
        } 
        fclose($stream);
        return $data;
    } 
    public function disconnect() { 
        $this->exec('exit;'); 
        $this->connection = null; 
    } 
    public function __destruct() { 
        $this->disconnect(); 
    } 
} 
?> 