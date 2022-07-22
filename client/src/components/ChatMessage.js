// import { useEffect, useState, useRef } from "react";
import ProfilePicture from "./ProfilePicture";
import { Link } from "react-router-dom";

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} @ ${date.toLocaleTimeString()}`;
}

function ChatMessage({
    first_name,
    last_name,
    profile_picture_url,
    sender_id,
    text,
    created_at,
}) {
    return (
        <article className="message_container">
            <Link
                to={`/user/${sender_id}`}
                title={`${first_name} ${last_name}`}
            >
                <ProfilePicture
                    {...{ first_name, last_name, profile_picture_url }}
                />
            </Link>
            <p className="message_sender">
                {first_name} {last_name}
            </p>

            <div className="message_contents">
                <p className="message_text">
                    <time className="message_time">
                        {formatDate(created_at)}
                    </time>
                    <br />
                    {text}
                </p>
            </div>
        </article>
    );
}

export default ChatMessage;
