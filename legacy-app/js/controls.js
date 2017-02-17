(function(){
    var torrent_srv_control = {
        server_status: 'dead',
        add_lm_torrent : function(url){
            var dfd = $.Deferred();
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: {'action': 'addTorrent', 'url' : url },
                success: function(data){
                    dfd.resolve(data);
                },
                error: function(data){
                    dfd.reject(data);
                },
                dataType: 'html'
            });
            return dfd.promise();
        },
        start_utorrent_server : function(){
            var dfd = $.Deferred();
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: {'action': 'start_utserver'},
                success: function(data){
                    dfd.resolve(data);
                },
                error: function(data){
                    dfd.fail(data);
                },
                dataType: 'json'
            });
            return dfd.promise();
        },
        stop_utorrent_server : function(){
            var dfd = $.Deferred();
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: {'action': 'stop_utserver'},
                success: function(data){
                    dfd.resolve(data);
                },
                error: function(data){
                    dfd.fail(data);
                },
                dataType: 'json'
            });
            return dfd.promise();
        },
        check_utorrent_status : function(){
            var dfd = $.Deferred();
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: {'action': 'get_server_status'},
                success: function(data){
                    dfd.resolve(data);
                },
                error: function(data){
                    dfd.reject(data);
                },
                dataType: 'json'
            });
            return dfd.promise();
        },
        torrent_status_timer : null,
        torrent_delta_ts : null,
        get_torrent_status : function(){
            var _this = this;
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: {
                    'action': 'get_torrent_status',
                    'delta_ts' : _this.torrent_delta_ts
                },
                success: function(data){
                    if(typeof data.delta_ts != 'undefined'){
                        _this.torrent_delta_ts = data.delta_ts;
                    }
                    gui_control.display_statuses(data);
                },
                error: function(data){
                },
                dataType: 'json'
            });
        },
        get_torrent_status_subscribe : function(){
            if(this.torrent_status_timer == null){
                var _this = this;
                this.torrent_status_timer = setInterval(function(){
                    if(_this.server_status == 'alive'){
                        _this.get_torrent_status();
                    }
                }, 5000);
            }
        },
        get_torrent_status_unsubscribe : function(){
            clearInterval(this.torrent_status_timer);
            this.torrent_status_timer = null;
        },
        get_free_space: function(){
            $.ajax({
                type: 'POST',
                url: 'ajax.php',
                data: {
                    action: 'get_free_space'
                },
                dataType: 'json'
            }).then(function(data){
                $('#free_space').text(data.free_space + ' GB');
                if(data.free_space < 40){
                    $('#free_space').removeClass('label-info').addClass('label-warning');
                }
                else{
                    if(data.free_space < 15){
                        $('#free_space').removeClass('label-info').addClass('label-danger');
                    }
                }
            });
        }
    };
    var gui_control = {
        indicate_server_alive : function(){
            $("#status").removeClass("label-danger").addClass("label-success").text("Gyvas");
        },
        indicate_server_dead : function(){
            $("#status").removeClass("label-success").addClass("label-danger").text("Miręs");
        },
        start_url_add : function(){
            $("#add_btn_div").hide();
            $('#add_progress').show();
        },
        stop_url_add : function(){
            $('#add_progress').hide();
            $("#add_btn_div").show();
            $("#url").val("");
        },
        hide_url_alerts : function(){
            $(".alert-success").hide();
            $(".alert-danger").hide();
        },
        indicate_url_added : function(){
            $(".alert.alert-success").show();
        },
        indicate_url_not_added : function(){
            $(".alert.alert-danger").show();
        },
        enable_server_start : function(){
            $("#start_server").removeAttr("disabled").removeClass("btn-default").addClass("btn-primary");
        },
        enable_server_stop : function(){
            $("#stop_server").removeAttr("disabled").removeClass("btn-default").addClass("btn-warning");
        },
        enable_torrent_addition : function(){
            $("#add_torrent").removeAttr("disabled").removeClass("btn-default").addClass("btn-success");
        },
        disable_server_start : function(){
            $("#start_server").attr("disabled", "disabled").removeClass("btn-primary").addClass("btn-default");
        },
        disable_server_stop : function(){
            $("#stop_server").attr("disabled", "disabled").removeClass("btn-warning").addClass("btn-default");
        },
        disable_torrent_addition : function(){
            $("#add_torrent").attr("disabled", "disabled").removeClass("btn-success").addClass("btn-default");
        },
        show_global_warning_message : function(message){
            $(".container").prepend('<div class="alert alert-warning alert-dismissible" role="alert">' +
                                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                        message + '</div>');
        },
        server_control_start : function(){
            $("#start_server").hide();
            $("#stop_server").hide();
            $("#server_control_progress").show();
        },
        server_control_stop : function(){
            $("#start_server").show();
            $("#stop_server").show();
            $("#server_control_progress").hide();
        },
        display_statuses : function(statuses){
            if(statuses.list != null){
                $('#statuses').empty();
                var only_active = $('#show_only_active').prop('checked');
                statuses.list.map(function(obj){
                    if((only_active && obj.status != "Finished") || !only_active){
                        var progress = [
                            '<div class="progress pull-left" style="width: 75%;">',
                                '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+obj.progress+'" aria-valuemin="0" aria-valuemax="100" style="width: '+obj.progress+'%">',
                                    obj.progress + '%',
                                '</div>',
                            '</div>'].join('');

                        $('#statuses').append('<div class="row"></div>');
                        $('#statuses .row:last')
                            .append('<div class="col-md-4">' + obj.name.substring(0, 35) + '</div>')
                            .append('<div class="col-md-8">' + progress + '<span style="margin-top: 0.5%; width: 24%;" class="label label-success pull-right">' + obj.download_speed + ' MB/s</span></div>');
                    }
                });
            }
        },
        enable_torrent_status_autorefresh : function(){
            $('#autorefresh').prop('checked', true);
        },
        disable_torrent_status_autorefresh : function(){
            $('#autorefresh').prop('checked', false);
        },
        enable_torrent_only_active : function(){
            $('#show_only_active').prop('checked', true);
        },
        disable_torrent_only_active : function(){
            $('#show_only_active').prop('checked', false);
        },
        show_torrent_status_loader: function(){
            $('#statuses').empty().append(
                    ['<div class="progress" style="margin-left: 20px; margin-right: 20px;" id="server_control_progress">',
                        '<div class="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">',
                        '</div>',
                        '</div>'].join(''));
        }
    }
    $(document).ready(function(){
        $('#url').val('').focus();
        gui_control.server_control_start();
        torrent_srv_control.get_free_space();
        torrent_srv_control.check_utorrent_status()
            .done(function(result){
                gui_control.server_control_stop();
                if(result.status == "alive"){
                    gui_control.indicate_server_alive();
                    gui_control.enable_server_stop();
                    gui_control.disable_server_start();
                    gui_control.enable_torrent_addition();
                    gui_control.show_torrent_status_loader();
                    torrent_srv_control.server_status = 'alive';
                    torrent_srv_control.get_torrent_status();
                    torrent_srv_control.get_torrent_status_subscribe();
                }
                else{
                    gui_control.indicate_server_dead();
                    gui_control.enable_server_start();
                    gui_control.disable_server_stop();
                    torrent_srv_control.server_status = 'dead';
                    torrent_srv_control.get_torrent_status_unsubscribe();
                    gui_control.disable_torrent_status_autorefresh();
                }
            })
            .fail(function(result){
                gui_control.server_control_stop();
                gui_control.indicate_server_dead();
                gui_control.show_global_warning_message("Kažkas atsitiko: " + result);
            });
        $('#add_torrent').click(function(){
            if($("#url").val().length < 10){
                gui_control.show_global_warning_message("Blogas linkas, pataisyk!");
            }
            else{
                gui_control.start_url_add();
                torrent_srv_control.add_lm_torrent($("#url").val())
                    .done(function(data){
                        gui_control.stop_url_add();
                        try {
                            var data_json = JSON.parse(data);
                        } catch (err) {
                            var data_json = null;
                        }
                        if(typeof data_json == 'object' && typeof data_json['build'] != 'undefined'){

                            gui_control.indicate_url_added();
                            setTimeout(function(){
                                gui_control.hide_url_alerts();
                            }, 3000);
                        }
                        else{
                            gui_control.indicate_url_not_added();
                            gui_control.show_global_warning_message(data);
                            setTimeout(function(){
                                gui_control.hide_url_alerts();
                            }, 3000);
                        }
                    })
                    .fail(function(){
                        gui_control.stop_url_add();
                        gui_control.indicate_url_not_added();
                        setTimeout(function(){
                            gui_control.hide_url_alerts();
                        }, 3000);
                    });
            }
        });
        $('#start_server').click(function(){
            gui_control.server_control_start();
            torrent_srv_control.start_utorrent_server()
                .done(function(data){
                    gui_control.server_control_stop();
                    if(data.status == "started"){
                        gui_control.indicate_server_alive();
                        gui_control.enable_server_stop();
                        gui_control.disable_server_start();
                        gui_control.enable_torrent_addition();
                        gui_control.show_torrent_status_loader();
                        torrent_srv_control.server_status = 'alive';
                        torrent_srv_control.get_torrent_status();
                        torrent_srv_control.get_torrent_status_subscribe();
                        gui_control.enable_torrent_status_autorefresh();
                    }
                    else{
                        gui_control.indicate_server_dead();
                        gui_control.enable_server_start();
                        gui_control.disable_server_stop();
                        torrent_srv_control.server_status = 'dead';
                        torrent_srv_control.get_torrent_status_unsubscribe();
                        gui_control.disable_torrent_status_autorefresh();
                    }
                })
                .fail(function(data){
                    gui_control.server_control_stop();
                    gui_control.show_global_warning_message("Serveris nestartuoja: " + data);
                });
        });
        $('#stop_server').click(function(){
            gui_control.server_control_start();
            torrent_srv_control.stop_utorrent_server()
                .done(function(data){
                    gui_control.server_control_stop();
                    if(data.status == "stopped"){
                        gui_control.indicate_server_dead();
                        gui_control.enable_server_start();
                        gui_control.disable_server_stop();
                        gui_control.disable_torrent_addition();
                        torrent_srv_control.server_status = 'dead';
                        torrent_srv_control.get_torrent_status_unsubscribe();
                        gui_control.disable_torrent_status_autorefresh();
                    }
                })
                .fail(function(data){
                    gui_control.server_control_stop();
                    gui_control.show_global_warning_message("Kažkas atsitiko: " + data);
                });
        });
        $('#autorefresh').change(function(){
            if(this.checked){
                torrent_srv_control.get_torrent_status();
                torrent_srv_control.get_torrent_status_subscribe();
            }
            else{
                torrent_srv_control.get_torrent_status_unsubscribe();
            }
        });
        $('#refresh_now').click(function(){
            torrent_srv_control.get_torrent_status();
        });
        $('#show_only_active').change(function(){
            torrent_srv_control.get_torrent_status();
        });
    });
})();
