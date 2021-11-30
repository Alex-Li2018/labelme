<template>
    <div class="text_wrap">
        <div class="flex_layout tags-list">
            <div 
                v-for="(item, index) in shortcutList" 
                :key="index"
                class="flex_layout tags-item_wrap pointer"
                :style="{
                    '--background': item.background,
                    '--color': item.color
                }"
                @click="selectAnnotationType(item)">
                <div class="tags-label">{{ item.label }}</div>
                <div class="tags-hot-key">{{ item.hotKey }}</div>
            </div>
        </div>
        <div @mouseup="handleMouseUp" v-html="html">
        </div> 
    </div>
</template>

<script>
import { nanoid } from 'nanoid'
import { htmlEscape, createSpanStylesheet } from '@/utils/html.js'
import { highlightRange } from '@/utils/selectionTools.js'

export default {
    data() {
        return {
            shortcutList: [
                {
                    label: 'money',
                    hotKey: 1,
                    color: '#72bf7d',
                    background: 'rgba(114, 191, 160, 0.3)'
                },
                {
                    label: 'fact',
                    hotKey: 2,
                    color: '#bf8072',
                    background: '#bf807226'
                },
            ],
            selectObj: {

            },
            html: `Showers continued throughout the week in the Bahia cocoa zone, alleviating the drought since early January and improving prospects for the coming temporao, although normal humidity levels have not been restored, Comissaria Smith said in its weekly review.

            The dry period means the temporao will be late this year. Arrivals for the week ended February 22 were 155,221 bags of 60 kilos making a cumulative total for the season of 5.93 mln against 5.81 at the same stage last year. Again it seems that cocoa delivered earlier on consignment was included in the arrivals figures.

            Comissaria Smith said there is still some doubt as to how much old crop cocoa is still available as harvesting has practically come to an end. With total Bahia crop estimates around 6.4 mln bags and sales standing at almost 6.2 mln there are a few hundred thousand bags still in the hands of farmers, middlemen, exporters and processors.`
        }
    },
    created() {
        this.html = this.initAnnotation()
    },
    methods: {
        selectAnnotationType(item) {
            this.selectObj = item
        },
        initAnnotation() {
            // 1. 将换行符替换为<br />
            const content = this.html || "";
            const newLineReplacement = "<br/>";

            return htmlEscape(content).replace(/\n|\r/g, newLineReplacement)
        },
        handleMouseUp(ev) {
            console.log(ev)
            const selection = window.getSelection()
            const selectionText = selection.toString().replace(/[\n\r]/g, "\\n");

            if (selection.isCollapsed) return;
            for (let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(i)
                console.log(nanoid(5))
                // 创建style标签存入这个标注固定的样式
                const { className } = createSpanStylesheet(ev.target.ownerDocument, nanoid(5), this.selectObj.background)
                //  span标签包裹range内的文字
                highlightRange(range, { label: this.selectObj.label, classNames: [className] })
            }
            console.log(selection, selectionText)
        }
    }
}
</script>

<style>
.aaa {
    background-color: yellow;
}
.pointer {
    cursor: pointer;
}
.flex_layout {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.tags-list {
    margin-bottom: 20px;
}
.tags-item_wrap {
    display: inline-flex;
    height: 26px;
    padding: 0 8px;
    margin: 0;
    border-radius: 3px;
    font-weight: 400;
    font-size: 14px;
    line-height: 26px;
    background-color: var(--background);
    color: #333;
    border-left-style: solid;
    border-left-width: 4px;
    border-left-color: var(--color);
    position: relative;
    align-items: center;
    margin-left: 8px;
}
.tags-hot-key {
    color: rgba(0,0,0,0.4);
    font-size: 13px;
    margin-left: 12px;
}
</style>