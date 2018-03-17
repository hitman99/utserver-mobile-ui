import React from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Modal
} from 'semantic-ui-react';

export default class DeleteModal extends React.Component {

    render() {
        const { title, onConfirm, onCancel } = this.props;
        return (
            <Modal dimmer="blurring" open={true} onClose={onCancel}>
                <Modal.Header>Deleting torrent</Modal.Header>
                <Modal.Content>
                    Are you sure you want to delete { title } ?
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={onConfirm}>
                        Yes
                    </Button>
                    <Button onClick={onCancel}>
                        No
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

}

DeleteModal.propTypes = {
    title: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};