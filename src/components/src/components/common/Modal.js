import React from 'react'
import { Redirect } from 'react-router-dom';
const Modal = ({ show, disableBtn, modalId }) => {
	return (
		<div className="container" style={{ display: show ? 'block' : 'none' }}>
			<div className="modal fade" id={modalId} role="dialog">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam, perferendis repellat optio excepturi explicabo facilis asperiores assumenda odio accusamus molestias rerum quidem porro ad possimus incidunt soluta nostrum inventore blanditiis.
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
							<button
								type="submit"
								name="submit"
								disabled={disableBtn}
								className="btn btn-default">Save</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Modal