import React from "react";
import type { Schedule } from "../model/schedule";
import type { MovieWithSchedule } from "../model/movie";

/**
 * 电影放映时间表项
 * @param movie 电影信息
 * @returns 
 */
function ScheduleItem({ movie }: { movie: MovieWithSchedule }) {
    return (
        <p className="MsoNormal" style={{ marginLeft: "21pt" }}>
            {movie.isSalon &&
                <b>
                    <span
                        lang="EN-US"
                        style={{
                            fontFamily: "华文宋体",
                            textShadow: `
                                0.2px 0 0 #000,
                                0 0.2px 0 #000,
                                -0.2px 0 0 #000,
                                0 -0.2px 0 #000
                            `,
                            color: "#000"
                        }}
                    >
                        {movie.showDate} <span lang="EN-US">{movie.startTime}-{movie.endTime}</span>《{movie.chinese}》
                    </span>
                </b>
            }
            {!movie.isSalon &&
                <span lang="EN-US" style={{ fontFamily: "华文宋体" }}>{movie.showDate} {movie.startTime}-{movie.endTime}《{movie.chinese}》</span>
            }
        </p>
    )
}

/**
 * 电影放映时间表
 * A List of ScheduleItem
 * @returns 
 */
export default function ScheduleTable({ schedule }: { schedule: Schedule }) {
    const movies = schedule.movies;
    return (
        <>
            {movies.map((movie) => (
                <ScheduleItem key={movie.chinese} movie={movie} />
            ))}


            <p className="MsoNormal">
                <span lang="EN-US" style={{ fontFamily: "华文仿宋" }}>&nbsp;</span>
            </p>

            <p className="MsoNormal">
                <span className="MsoSubtleReference">
                    <span lang="EN-US">*</span>
                    时间按照片长，往上取几点
                    <span lang="EN-US">15</span>
                    分
                    <span lang="EN-US">/</span>
                    半点
                    <span lang="EN-US">/</span>
                    几点
                    <span lang="EN-US">45</span>
                    分
                    <span lang="EN-US">/</span>
                    整点
                </span>
            </p>

            <p className="MsoNormal">
                <span className="MsoSubtleReference">
                    <span lang="EN-US">*</span>
                    沙龙的话记得在放映时间的基础上加半个小时左右
                </span>
            </p>

            <p className="MsoNormal">
                <span className="MsoSubtleReference">
                    <span lang="EN-US">*</span>
                    地点由放映部部长李炜森向外联部汇总后加在文档中
                </span>
            </p>

            <p className="MsoNormal">
                <span lang="EN-US" style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>
        </>
    )
}