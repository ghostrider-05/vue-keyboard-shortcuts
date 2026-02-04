import fs from 'fs'
import { resolve } from 'path'

export default {
    async paths() {
        const boards = fs
            .readdirSync(resolve('src/.vitepress/config'))
            .map(filename => {
                return {
                    states: JSON.parse(fs.readFileSync(resolve('src/.vitepress/config/' + filename))),
                    course: filename.split('.')[1],
                }
            })
        
        return boards.map(({ course, states }) => {
            return {
                params: { course },
                content: `<CourseKeyboard :states="${JSON.stringify(states).replace(/"/g, "'")}" />`,
            };
        })
    },
};
